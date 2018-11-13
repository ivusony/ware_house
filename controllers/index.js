{
    const   Unit    = require('../models/unitModel'),
            User    = require('../models/user');
    //custom date stamp
    const timestamp = require("../getDate");

    module.exports = {
        redirect : function(req, res){
            res.redirect('/stanje');
        },
        renderUnits : function(req, res){
            Unit.find({}, function(err, units){
                if (err) {
                    console.log('error' + err);
                    res.send(`Error occured. No units found.`);
                }else{
                    res.render('index', {
                        units : units,
                        currentUser: res.locals.currentUser
                    })
                }
            });
            // console.log(req.user)
        },
        showWelcome : function(req, res, next){
            res.send(res.locals.currentUser)
        },
        unshowWelcome : function(req, res, next){
            User.findByIdAndUpdate({_id:req.body.id}, {
                $set:{showWelcome:false}
            }, (err, updated)=>{
                if (err) {
                    console.log(err)
                }else{
                    console.log(updated)
                }
            })
        },
        searchUnits : function(req, res, next){
            let search = req.sanitize(req.body.value);
            let srcby  = req.body.srcby;
        
            //setting the qury dinam. by passing objet to query
            var query = {};
            query[srcby] = {$regex: new RegExp(search, 'i')};
            
            Unit.find(query, function(err, unitfound){
                if(!unitfound.length){
                    res.sendStatus(400);
                }else{
                    res.json(unitfound);
                }
            })
        },
        destroyUnit : function(req, res){
            Unit.findByIdAndRemove(req.body.id, function(err){
                if(err){
                    res.sendStatus(404);
                }else{
                    res.sendStatus(200);
                }
            })
        }
    }
}//end block