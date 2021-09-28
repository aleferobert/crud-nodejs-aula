const {Schema, model} = require('mongoose');

const NotesSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    user: {
        type: 'ObjectId',
        require: true
         
    },
},{
    timestamps: true

});



module.exports = model('Note',NotesSchema);