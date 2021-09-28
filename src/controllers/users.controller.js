const usersCtrl = {};

const passport = require('passport');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { text } = require('express');

usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersCtrl.signup = async (req, res) => {
    const erros = []
    const { name, email, confirm_email, password, confirm_password } = req.body;
    if (password != confirm_password) {
        erros.push({ text: 'Senhas diferentes' });
    };
    if (password.length < 4) {
        erros.push({ text: 'Senha curta (minímo 4 caracteres)' });
    };
    if (email != confirm_email) {
        erros.push({ text: "E-mail's diferentes" })
    }
    if (erros.length != 0) {
        res.render('users/signup', { erros, name, email });
    } else {
        const emailUser = await User.findOne({ email });
        if (emailUser) {
            erros.push({ text: 'E-mail já cadastrado!' });
            res.render('users/signup'), { erros, name, email };
        } else {
            const newUser = new User({ name, email, password })
            newUser.password = await newUser.hashPassword(password);
            /*await newUser.save();
            req.flash('success_msg', 'Cadastro realizado com Sucesso!');
            res.redirect('/users/login');*/

            req.flash('confirm_reg', newUser);
            res.redirect('/users/confirm_register');
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


usersCtrl.confirm_register = (req, res) => {
    console.log(req.flash('confirm_reg'));
    if (req.flash('confirm_reg')) {
        const transporter = nodemailer.createTransport({
            host: process.env.HOSTMAIL,
            port: process.env.PORTMAIL,
            auth: { user: process.env.USERMAIL, pass: process.env.PASSMAIL }
        });

        transporter.sendMail({
            from: req.body.email,
            to: req.body.name,
            replyTo: process.env.SERVEREMAIL,
            subject: "Código de confirmação de cadastrado - NODEAPP",
            text: "1234"
        });

        //res.render()
    }
}



module.exports = usersCtrl;