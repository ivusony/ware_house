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


// ADD USER TO DB

let username = 'admin';
let admin = 'enabled';
let password = 'admin';

User.register(new User({username: username, admin: admin}),password, function(err, user){
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
