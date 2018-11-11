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
//CONTROLLERS
const   loginController     = require("./controllers/login"),
        adminController     = require("./controllers/admin"),
        indexController     = require("./controllers/index"),
        inputController     = require("./controllers/input"),
        editController      = require("./controllers/edit");
//ROUTES
app.get('/login', loginController.renderPage); //render login
app.post('/login' , loginController.authUser); //auth user
app.get('/logout', loginController.logout);  //logout user
//===================================================================
app.get('/admin', loginController.isLoggedIn, loginController.isAuthorised, adminController.renderUsers); //render existing users
app.post('/admin', adminController.addUser); //add user
app.delete('/admin/:id', adminController.destroyUser); //destroy user
//==================================================================
app.get('/', indexController.redirect); //redirect to stanje
app.get('/stanje', loginController.isLoggedIn, indexController.renderUnits); //render index page with units and current user
app.post('/search', indexController.searchUnits); //search units
app.delete('/stanje/:id', indexController.destroyUnit)//destroy unit
//==================================================================
app.get('/stanje/noviunos', loginController.isLoggedIn, inputController.renderPage); //render new input form
app.post('/stanje', inputController.saveUnit); //save new unit
app.get('/stanje/:id',  loginController.isLoggedIn , editController.renderEdit); //render edit form
app.put('/stanje/:id', editController.saveEdited); //save changes
//LOCALHOST CONFIG
app.listen(port, function(){
    console.log('App is running')
})
