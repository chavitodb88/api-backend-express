const bcryptjs = require("bcryptjs");
const Role = require("../models/Role");
const User = require("../models/User");

 
const createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount();
        if(count > 0) return;

        const returns = await Promise.all([
            new Role({name:"admin"}).save(),
            new Role({name:"user"}).save(),
        ])
        console.log({returns})
    } catch (error) {
        console.error(error); 
    }
}

const createAdminUser = async () => {
    try {
        const count = await User.estimatedDocumentCount();
        if(count > 0) return;

        const adminRole = await Role.findOne({name:"admin"});
        const salt = bcryptjs.genSaltSync();
        
        await new User({
            name:"Super Admin",
            email:"chavitodb88@me.com",
            password:bcryptjs.hashSync("123456", salt),
            roles:[adminRole.id]
        }).save();
    } catch (error) {
        console.error(error); 
    }
}

module.exports = {
    createRoles,
    createAdminUser
}