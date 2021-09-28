const helpers = {};

helpers.isAuthenticated = (req,res,next) => {
    //isAuthenticated vem do passport
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('failure_msg','Não autorizado');
    res.redirect('/users/login');
};

module.exports = helpers;