{
    let express     = require('express'),
        router      = express.Router();

    let loginController     = require("../controllers/login");    

    router.get('/login', loginController.renderPage); //render login 
    router.post('/login' , loginController.authUser); //auth user
    router.get('/logout', loginController.logout);  //logout user
    
    
    module.exports = router;
}