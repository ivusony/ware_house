{
    const passport = require('passport');

    module.exports = {
        renderPage : function(req, res){
            res.render('login');
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
        },
        isLoggedIn : function isLoggedIn(req, res, next){
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect('/login');
        },
        isAuthorised : function isAuthorised(req, res, next){
            if(req.user.username != 'superadmin' && !req.user.canEdit){
                res.redirect('/')
            }else{
                return next()
            }
        }
    }
}