const { Router } = require('express');
const router = Router();

const { isAuthenticated } = require('../helpers/auth');

const { createNewNode, deleteNote, renderEditForm, renderNoteForm, renderNotes, updateNote } = require('../controllers/notes.controller');

//New Note
router.get('/notes/add', isAuthenticated, renderNoteForm);
router.post('/notes/add', isAuthenticated, createNewNode);

// Get All Notes
router.get('/notes', isAuthenticated, renderNotes);

//Edit Notes
router.get('/notes/edit/:id', isAuthenticated, renderEditForm);
router.put('/notes/edit/:id', isAuthenticated, updateNote);

//Delete Note
router.delete('/notes/delete/:id', isAuthenticated, deleteNote);

module.exports = router;