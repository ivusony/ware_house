var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');



var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    warehouse: String,
    canCreate: Boolean,
    canEdit: Boolean,
    canDelete: Boolean
});

UserSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model('User', UserSchema);