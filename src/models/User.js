const {Schema, model} = require('mongoose');
var SHA256 = require("crypto-js/sha256");

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
},{
    timestamps: true

});

UserSchema.methods.hashPassword = password =>{
    return SHA256(password);
};

module.exports = model('User',UserSchema);