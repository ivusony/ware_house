{
    const User = require('../models/user');    //User model

    module.exports = {
        renderUsers : function(req, res){
            User.find({}, function(err, users){
                if (err) {
                    console.log('error' + err)
                }else{
                    res.render('adminPage', {
                        users : users
                    })
                }
            });
        },
        addUser : function(req, res){
            User.register(new User({username: req.body.username, canCreate: req.body.canCreate, canEdit: req.body.canEdit, canDelete: req.body.canDelete}),req.body.password, function(err, user){
                if (err) {
                    console.log('=================================');
                    console.log('Error adding user:');
                    console.log(err);
                    console.log('=================================');
                }else{
                    console.log('=================================');
                    console.log('User added:');
                    console.log(user);
                    console.log('================================='); 
                    res.redirect('/admin');
                }
            })
            
        },
        destroyUser : function(req, res){
            //destroy 
            User.findByIdAndRemove(req.params.id, function(err){
                if(err){
                    console.log('===============================');
                    console.log('error:');
                    console.log(err);
                    console.log('===============================');
                    res.redirect('/admin');
                }else{
                    res.redirect('/admin');
                }
            })
        }
    }
}//end block