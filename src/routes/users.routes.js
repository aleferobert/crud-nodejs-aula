const { Router } = require('express');
const router = Router();

const { renderSignUpForm, 
    signup, 
    renderLoginForm,
    login, 
    logout } = require('../controllers/users.controller')

router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', signup);

router.get('/users/login', renderLoginForm);
router.post('/users/login', login);

router.get('/users/logout', logout);

module.exports = router;