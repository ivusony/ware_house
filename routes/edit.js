{
    let express         = require("express"),
        router          = express.Router();

    let loginController     = require("../controllers/login"),
        editController      = require("../controllers/edit");

    router.get('/stanje/:id',  loginController.isLoggedIn , editController.renderEdit); //render edit form
    router.put('/stanje/:id', editController.saveEdited); //save changes

    module.exports = router;
}