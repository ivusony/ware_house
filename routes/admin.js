{
    let express         = require("express"),
        router          = express.Router();
    
    let loginController     = require("../controllers/login"),
        adminController     = require("../controllers/admin");

        router.get('/admin', loginController.isLoggedIn, loginController.isAuthorised, adminController.renderUsers); //render existing users
        router.post('/admin', adminController.addUser); //add user
        router.delete('/admin/:id', adminController.destroyUser); //destroy user    

    module.exports = router;
}