const   express                 = require('express'),
        app                     = express(),
        router                  = express.Router(),
        port                    = 3000,
        bodyParser              = require('body-parser'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        localStrategy           = require('passport-local'),
        passportLocalMongoose   = require('passport-local-mongoose'),
        methodOveride           = require('method-override'),
        expressSanitizer        = require('express-sanitizer');

//DEFINING ROUTES
const   loginRoutes               = require('./routes/login'), 
        adminRoutes               = require('./routes/admin'), 
        indexRoutes               = require('./routes/index'),  
        inputRoutes               = require('./routes/input'), 
        editRoutes                = require('./routes/edit');    
//new user schema
const   User                    = require('./models/user');
//DB CONNECTION
        mongoose.connect('mongodb://localhost/testdb');
//TEMPLATING ENGINE SETUP
        app.set('view engine', 'ejs');
//SESSION
        app.use(require('express-session')(
            {
                secret: 'Ivan is the best',
                resave: false,
                saveUninitialized: false
                // expires: new Date(Date.now() + (20 * 1000))
            }
        ));
//STATIC FILES FOLDER
        app.use(express.static(__dirname + '/public'));
//BODY PARSER SETUP
        app.use(bodyParser.urlencoded({extended: true}));
//PUT, DELETE METHOD OVERIDE
        app.use(methodOveride('_method'));
        app.use(expressSanitizer());
//PASSPORTJS SETUP
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new localStrategy(User.authenticate()))   
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
//USER MIDDLEWARE SETUP
        app.use(function(req, res, next){
            res.locals.currentUser = req.user;
            next();
        });
//CALLING ROUTES
        app.use(loginRoutes);
        app.use(adminRoutes);
        app.use(indexRoutes);
        app.use(inputRoutes);
        app.use(editRoutes);

//LOCALHOST CONFIG
app.listen(port, function(){
    console.log('App is running')
})
