{
    const   Unit    = require('../models/unitModel'),
            timestamp   = require('../getDate');

    module.exports = {
        renderEdit : function(req, res){
            Unit.findById(req.params.id, (err, foundUnit)=>{
                if (err) {
                    res.redirect('/stanje')
                }else{
                    res.render('edit', {
                        unit: foundUnit
                    })
                }
            })
        },
        saveEdited : (req, res)=>{
            function calc(){
                if (req.body.add>0 && req.body.substract>0) {
                    req.body.ammount = (Math.floor(req.body.ammount) + Math.floor(req.body.add)) - Math.floor(req.body.substract);
                }else if(req.body.add>0){
                    req.body.ammount = (Math.floor(req.body.ammount) + Math.floor(req.body.add));
                }else{
                    req.body.ammount = Math.floor(req.body.ammount) - Math.floor(req.body.substract);
                }
                return req.body.ammount;
            }
        Unit.findByIdAndUpdate(req.params.id, {ammount: calc() ,$push: { changes: {by: req.user.username, added: parseInt(req.body.add), substracted: parseInt(req.body.substract), to: parseInt(req.body.ammount), date: timestamp.date(), comment: req.body.comment} } }, (err, updatedUnit)=>{
            if (err) {
                res.redirect('/stanje');
                console(err);
            }else{
                res.redirect('/stanje/'+ req.params.id);
                // console.log(updatedUnit);
            }
        })
        }
    }
}//end block