{
    let express         = require("express"),
        router          = express.Router();

let loginController     = require("../controllers/login"),
    inputController     = require("../controllers/input");

    router.get('/stanje/noviunos', loginController.isLoggedIn, inputController.renderPage); //render new input form
    router.post('/stanje', inputController.saveUnit); //save new unit

    module.exports = router;
}