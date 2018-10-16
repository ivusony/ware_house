let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOveride = require('method-override'),
    expressSanitizer = require('express-sanitizer');

let User = require('./models/user'); 

mongoose.connect('mongodb://localhost/magacin_app');


// ADD SUPERADMIN TO DB


User.register(new User({username: 'superadmin', canCreate: true, canEdit: true, canDelete: true}),'superadmin', function(err, user){
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
    }
})

//UPDATE USER
// let newUsername = 'admin';
// let admin = 'enabled';
// let newPassword = 'admin';

// User.findOneAndUpdate({username: 'test1'}, newPassword,  {
//     username: newUsername,
//     admin: admin
// }, function(err, updatedUser){
//     if (err) {
//         console.log('=================================');
//         console.log('Error updating user:');
//         console.log(err);
//         console.log('=================================');
//     }else{
//         console.log('=================================');
//         console.log('User updated:');
//         console.log(updatedUser);
//         console.log('================================='); 
//     }
// })

//REMOVEUSER FROM DB


// User.remove({username: 'admin'}, function(err, userRemoved){
//     if (err) {
//         console.log('=============================');
//         console.log('Unable to remove user:');
//         console.log(err);
//         console.log('=============================');
//     }else{
//         console.log('=============================');
//         console.log('User removed:');
//         console.log(userRemoved);
//         console.log('=============================');
//     }
// })