const { Router } = require('express');
const router = Router();

//const { isAuthenticated } = require('../helpers/auth');

const { renderSignUpForm, 
    signup, 
    renderLoginForm,
    login, 
    logout,
    confirm_register,
    addFriend} = require('../controllers/users.controller')

router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', signup);

router.get('/users/login', renderLoginForm);
router.post('/users/login', login);

router.get('/users/logout', logout);

router.post('/users/confirm_register',confirm_register);

//router.get('/users/addFriend/:name',isAuthenticated, addFriend);

module.exports = router;