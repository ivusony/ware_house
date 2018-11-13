{
    const passport = require('passport');
    const User    = require('../models/user');
    //custom date stamp
    const timestamp = require("../getDate");

    module.exports = {
        renderPage : function(req, res){
            res.render('login');
        },
        authUser : function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
              if (err) { 
                  return next(err); 
                }
              if (!user) { 
                  return res.redirect('/login'); 
                }
              req.logIn(user, function(err) {
                if (err) { 
                    return next(err); 
                }
                User.findOneAndUpdate({_id:user._id}, {$set:{lastActive:timestamp.date()}}, (err, userUpdated)=>{
                    if(err){
                        console.log('Failed to update user lastActive field')
                    }
                })
                return res.redirect('/stanje');
              });
            })(req, res, next);
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