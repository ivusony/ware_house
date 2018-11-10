{
    const passport = require('passport');

    module.exports = {
        renderPage : function(req, res){
            res.render('login')
        },
        authUser : 
                    passport.authenticate('local', {
                        successRedirect: '/stanje',
                        failureRedirect: '/login'
                    }), 
                        function(req, res){
                        console.log(callback)
                    },
        logout: function(req, res){
            req.logout();
            res.redirect('/login')
        }
    }
}