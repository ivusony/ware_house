let express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOveride = require('method-override'),
    expressSanitizer = require('express-sanitizer');

    //CUSTOM MODULES
let Unit = require('./models/unitModel'),   //new unit-input schema
    timestamp = require('./getDate'),
    User = require('./models/user');    //new user schema

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




//ROUTES


//===================================================================
//LOGIN/LOGOUT

//RENDER LOGIN FORM

app.get('/login', function(req, res){
    res.render('login')
})

//LOGIN LOGIC

app.post('/login' ,passport.authenticate('local', {
    successRedirect: '/stanje',
    failureRedirect: '/login'
}) , function(req, res){
    console.log(callback)
})

//LOGOUT
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login')
})
//===================================================================

//ADMIN PAGE

//RENDER

app.get('/admin', isLoggedIn, isAuthorised, function(req, res){
    User.find({}, function(err, users){
        if (err) {
            console.log('error' + err)
        }else{
            res.render('adminPage', {
                users : users
            })
        }
    });
})

//add user
app.post('/admin', function(req, res){
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
    
})

//destroy user

app.delete('/admin/:id', function(req, res){
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
})

//==================================================================

//INDEX ROUTE
app.get('/', function(req, res){
    res.redirect('/stanje');
})

//RENDER INDEX PAGE
app.get('/stanje', isLoggedIn, function(req, res){
    Unit.find({}, function(err, units){
        if (err) {
            console.log('error' + err)
        }else{
            res.render('index', {
                units : units,
                currentUser: req.user
            })
        }
    });
})

//SEARCH ITEMS
//search_items.js passing ajax query to app.js which queries the DB and sends back data to search_items.js

app.post('/search', function(req, res, next){
    let search = req.body.value;
    let srcby  = req.body.srcby;

    //setting the qury dinam. by passing objet to query
    var query = {};
    query[srcby] = {$regex: new RegExp(search, 'i')};
    
    Unit.find(query, function(err, unitfound){
        if(!unitfound.length){
            console.log("error! No units found " + err);
            res.sendStatus(400);
        }else{
            res.json(unitfound)
            console.log(unitfound)
        }
    })
})

//RENDER NEW INPUT FORM
app.get('/stanje/noviunos', isLoggedIn, function(req, res){
    res.render('newinputform')
})

//POST NEW INPUT AND REDIRECT TO INDEX
app.post('/stanje', function(req, res){
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
})


//DELETE INPUT

app.delete('/stanje/:id', function(req, res){
    //destroy 
    Unit.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log('===============================');
            console.log('error:');
            console.log(err);
            console.log('===============================');
            res.redirect('/');
        }else{
            res.redirect('/');
        }
    })
})


//RENDER EDIT FORM AND GET CHANGES FROM DB

app.get('/stanje/:id', function(req, res){
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
