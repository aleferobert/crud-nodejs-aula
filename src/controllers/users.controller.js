const usersCtrl = {};

const passport = require('passport');
const mail = require('../helpers/mail');
const User = require('../models/User');
const Confirm = require('../models/Confirm');
const neo4j = require('../database');

usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersCtrl.signup = async (req, res) => {
    const erros = [];
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
        const emailNot = await Confirm.findOne({ email });
        if (emailUser) {
            erros.push({ text: 'E-mail já cadastrado!' });
            res.render('users/signup'), { erros, name, email };
        }
        if (emailNot) {
            erros.push({text:"Email já cadastrado mas não confirmado. Por favor confirme agora para continuar"});
            res.render('users/confirm', {erros, email })
        }
        else {
            const newUser = new User({ password });
            /*newUser.password = await newUser.hashPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Cadastro realizado com Sucesso!');
            res.redirect('/users/login');*/
            var cod = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

            const newConfirm = new Confirm({ name, email, password, cod });
            newConfirm.password = await newUser.hashPassword(password);
            await newConfirm.save().then(

                mail.sendMail({
                    from: process.env.SERVERMAIL,
                    to: email,
                    subject: "Código de confirmação de cadastrado - NODEAPP",
                    text: cod.toString()
                }),
                res.render('users/confirm', { email })

            ).catch(err => {

            });
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


usersCtrl.confirm_register = async (req, res) => {
    const { email, cod } = req.body;
    const dados = await Confirm.findOne({ email });

    if (cod == dados.cod) {
        const { name, email, password } = dados;
        const newUser = new User({ name, email, password });
        await newUser.save();
        await Confirm.deleteOne({email});
        await neo4j.newUser(name);
        req.flash('success_msg', 'Cadastro realizado com Sucesso!');
        res.redirect('/users/login');
    } else {
        const erros = [];
        erros.push({text:'Código Inválido'});
        res.render('users/confirm', { erros,email })
    }
};

usersCtrl.addFriend = async (req,res) =>{
    await neo4j.newFriend(req.user.name,req.params.name);
    res.redirect('/notes');
};

module.exports = usersCtrl;