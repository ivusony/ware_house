let mongoose = require('mongoose');


//MONGOOSE MODEL CONFIG


    let Schema = new mongoose.Schema({
        code: String,
        name: String,
        ammount: Number,
        unit: String,
        changes: Array,
        created: 
        {
            type: Date,
            default: Date.now
        }
    });



module.exports = mongoose.model('unit', Schema); 





