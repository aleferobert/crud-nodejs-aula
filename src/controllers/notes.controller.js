const notesCtrl = {};
const Note = require('../models/Notes');
const neo4j = require('../database');

notesCtrl.renderNoteForm = (req, res) => {
    res.render('notes/new-notes');
};

notesCtrl.createNewNode = async (req, res) => {
    const { title, description } = req.body;
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg','Nota adicionada com Sucesso');
    res.redirect('/notes');
};

notesCtrl.renderNotes = async (req, res) => {
    const id_user = new Note({user:req.user.id}).user;
    const notes = await Note.aggregate([
        {$match:{user:id_user}},
        {$lookup:{from: "users",localField: "user",foreignField: "_id", as: "createdby"}}
    ]);
    const users = await neo4j.users(req.user.name);
    const friends =  await neo4j.allFriends(req.user.name);
    res.render('notes/all-notes', {notes, users, friends});
};

notesCtrl.renderEditForm = async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', { note });
};

notesCtrl.updateNote = async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate({_id:req.params.id,user:req.user.id}, { title, description }).then(req.flash('success_msg','Nota atualizada com Sucesso'))
    .catch(err => req.flash('failure_msg','Nota não atualizada- Erro:'+ err));
    res.redirect('/notes');
};

notesCtrl.deleteNote = async (req, res) => {
    await Note.findByIdAndDelete({_id:req.params.id,user:req.user.id}).then(req.flash('success_msg','Nota deletada com Sucesso'))
    .catch(err => req.flash('failure_msg','Nota não deletada- Erro:'+ err));
    res.redirect('/notes');
};

module.exports = notesCtrl;