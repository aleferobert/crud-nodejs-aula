const { Router } = require('express');
const router = Router();

const { isAuthenticated } = require('../helpers/auth');

const { renderSignUpForm, 
    signup, 
    renderLoginForm,
    login, 
    logout,
    confirm_register,
    addFriend,
    removeFriend,
    userPage} = require('../controllers/users.controller')

router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', signup);

router.get('/users/login', renderLoginForm);
router.post('/users/login', login);

router.get('/users/logout', logout);

router.post('/users/confirm_register',confirm_register);

router.get('/users/user/:name', isAuthenticated, userPage)
router.post('/users/addFriend/:name',isAuthenticated, addFriend);
router.delete('/users/addFriend/:name',isAuthenticated, removeFriend);

module.exports = router;