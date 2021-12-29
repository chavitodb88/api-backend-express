const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    name:{
        type:String,
        required:true
    }
});

RoleSchema.method('toJSON' ,function(){
    const {_id, __v, ...object} = this.toObject();

    object.id = _id;

    return object;
})

module.exports = model('Role',RoleSchema);