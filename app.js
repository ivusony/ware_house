const express = require('express'),
    app = express(),
    port = 3000,
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOveride = require('method-override'),
    expressSanitizer = require('express-sanitizer');

    //CUSTOM MODULES
const   Unit        = require('./models/unitModel'),   //new unit-input schema
        timestamp   = require('./getDate'),
        User        = require('./models/user');    //new user schema

    //APP CONFIG
    mongoose.connect('mongodb://localhost/magacin_app');
    app.set('view engine', 'ejs');
    app.use(require('express-session')(
        {
            secret: 'Ivan is the best',
            resave: false,
            saveUninitialized: false
            // expires: new Date(Date.now() + (20 * 1000))
        }
    ));
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOveride('_method'));
    app.use(expressSanitizer());
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new localStrategy(User.authenticate()))   
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        next();
    });

//CONTROLLERS

//login controller: hanles rendering and auth
const loginController = require("./controllers/login");
const adminController = require("./controllers/admin");
const indexController = require("./controllers/index");
const inputController = require("./controllers/input");

//ROUTES

//===================================================================
app.get('/login', loginController.renderPage); //render login
app.post('/login' , loginController.authUser); //auth user
app.get('/logout', loginController.logout);  //logout user
//===================================================================
app.get('/admin', isLoggedIn, isAuthorised, adminController.renderUsers); //render existing users
app.post('/admin', adminController.addUser); //add user
app.delete('/admin/:id', adminController.destroyUser); //destroy user
//==================================================================
app.get('/', indexController.redirect); //redirect to stanje
app.get('/stanje', isLoggedIn, indexController.renderUnits); //render index page with units and current user
app.post('/search', indexController.searchUnits); //search units
app.delete('/stanje/:id', indexController.destroyUnit)//destroy unit
//==================================================================
app.get('/stanje/noviunos', isLoggedIn, inputController.renderPage); //render new input form
app.post('/stanje', inputController.saveUnit); //save new unit



//RENDER EDIT FORM AND GET CHANGES FROM DB

app.get('/stanje/:id',  isLoggedIn ,function(req, res){
    Unit.findById(req.params.id, (err, foundUnit)=>{
        if (err) {
            res.redirect('/stanje')
        }else{
            res.render('edit', {
                unit: foundUnit
            })
        }
    })
})


//SAVE EDITED INPUT AND REDIRECT TO INDEX
app.put('/stanje/:id', (req, res)=>{
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
})




//SESSION CHECK MIDDLEWARE

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function isAuthorised(req, res, next){
    if(req.user.username != 'superadmin' && !req.user.canEdit){
        res.redirect('/')
    }else{
        return next()
    }
}


//LOCALHOST CONFIG
app.listen(port, function(){
    console.log('App is running')
})
