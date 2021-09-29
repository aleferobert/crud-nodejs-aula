const {Schema, model} = require('mongoose');

const ConfirmSchema = new Schema({
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
    },
    cod:{
        type: String,
        required: true
    },
},{
    timestamps: true

});

module.exports = model('Confirm',ConfirmSchema);