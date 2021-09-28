const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    //Match email's user
    const user = await User.findOne({email});
    if(!user){
        return done(null,false,{message: 'E-mail não encontrado!'});
    } else {
        //Match PasswordUser
        const hPassword = await user.hashPassword(password);
        if(hPassword == user.password){
            return done(null,user);
        } else {
            return done(null,false,{message:'Senha incorreta!'});
        }
    }
}));

//Guradar a session no servidor
passport.serializeUser((user,done)=>{
    done(null,user.id);
});

//Quando
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});