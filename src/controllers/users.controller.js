const usersCtrl = {};

const passport = require('passport');
const User = require('../models/User');

usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersCtrl.signup = async (req, res) => {
    const erros = []
    const { name, email, password, confirm_password } = req.body;
    if (password != confirm_password) {
        erros.push({ text: 'Senhas diferentes' });
    };
    if (password.length < 4) {
        erros.push({ text: 'Senha curta' });
    };
    if (erros.length != 0) {
        res.render('users/signup', { erros, name, email });
    } else {
        const emailUser = await User.findOne({ email });
        if (emailUser) {
            req.flash('failure_msg', 'E-mail já cadastrado!');
            res.redirect('/users/signup');
        } else {
            const newUser = new User({ name, email, password })
            newUser.password = await newUser.hashPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Cadastro realizado com Sucesso!');
            res.redirect('/users/login');
        }
    }
}
usersCtrl.renderLoginForm = (req, res) => {
    var msg = req.flash('error')
    if (msg.length != 0) {
        const erros = []
        erros.push({ text: msg });
        res.render('users/login', { erros });
    } else {
        res.render('users/login');
    }

};

usersCtrl.login = passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/notes',
    failureFlash: true
});

usersCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Deslogado');
    res.redirect('/users/login');
};
module.exports = usersCtrl;