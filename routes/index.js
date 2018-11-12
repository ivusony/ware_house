{
    let express = require('express'),
        router = express.Router(),
        loginController     = require("../controllers/login"),
        indexController     = require("../controllers/index");

        router.get('/', indexController.redirect); //redirect to stanje
        router.get('/stanje', loginController.isLoggedIn, indexController.renderUnits); //render index page with units and current user
        router.get('/stanje/welcome', loginController.isLoggedIn ,indexController.showWelcome);
        router.post('/stanje/welcome', indexController.unshowWelcome);
        router.post('/search', indexController.searchUnits); //search units
        router.delete('/stanje/:id', indexController.destroyUnit)//destroy unit

        module.exports = router;
}