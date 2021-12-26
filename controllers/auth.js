const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generateJWT } = require("../helpers/jwt");
const User = require("../models/User");

const createUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        let userDB = await User.findOne({ email });
        if (userDB) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un usuario con ese correo",
            });
        }
        userDB = new User(req.body);

        const salt = bcryptjs.genSaltSync();
        userDB.password = bcryptjs.hashSync(password, salt)

        await userDB.save();

        const token = await generateJWT(userDB.id, userDB.name)

        res.status(201).json({
            ok: true,
            uid: userDB.id,
            name: userDB.name,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error: Contacta con tu administrador",
        });
    }
};

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const userDB = await User.findOne({ email });
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario o la contraseña son incorrectos",
            });
        }

        const validPassword = bcryptjs.compareSync(password, userDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario o la contraseña son incorrectos",
            });
        }

        const token = await generateJWT(userDB.id, userDB.name)

        res.json({
            ok: true,
            uid: userDB.id,
            name: userDB.name,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error: Contacta con tu administrador",
        });
    }
};

const renewToken = async(req, res = response) => {
    try {
        const token = await generateJWT(req.uid, req.name)
        res.json({
            ok: true,
            uid: req.uid,
            name: req.name,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error: Contacta con tu administrador",
        });
    }
};

module.exports = {
    createUser,
    login,
    renewToken,
};
