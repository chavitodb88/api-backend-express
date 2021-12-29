const {response} = require('express');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const User = require('../models/User');


const validateJWT = (req, res = response, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: "No hay token en la peticion",
        });
    }

    try {
        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no valido",
        });
    }

    next();
}

const isAdmin = async (req, res = response, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: "No hay token en la peticion",
        });
    }

    try {
        const {uid} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        const user = await User.findById(uid);
        const roles = await Role.find({_id: {$in: user.roles}});
        const isAdmin = roles.find(rol => rol.name === 'admin');

        if(isAdmin === undefined){
            return res.status(403).json({
                ok: false,
                msg: "Usuario no autorizado",
            });
        }

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no valido",
        });
    }

    next();
} 

module.exports = {
    validateJWT,
    isAdmin
}