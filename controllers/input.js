{
    const   Unit    = require('../models/unitModel');

    module.exports = {
        renderPage : function(req, res){
            res.render('newinputform')
        },
        saveUnit : function(req, res){
            req.body.newUnit.code = req.sanitize(req.body.newUnit.code);
            req.body.newUnit.name = req.sanitize(req.body.newUnit.name);
            req.body.newUnit.ammount = req.sanitize(parseInt(req.body.newUnit.ammount));
        
            Unit.create(req.body.newUnit, function(err, unitCreated){
                if (err) {
                    res.render('newinputform', {
                        currentUser : req.user.username
                    });
                    console.log(err);
                }else{
                    res.redirect('/');
                    console.log('Data saved ' +  unitCreated);
                }
            })
        }
    }
}