var express = require('express');
var router = express.Router();
//var multer = require('multer');
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
    res.render('register', {
        'title': 'Register'
    });
});
router.get('/login', function(req, res, next) {
    res.render('login', {
        'title': 'Login'
    });
});
//var uploads = multer({ dest: 'uploads/' });
router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    /* if (req.files.profileimg) {
         console.log('uploading file');

         var profileimageOriginalName = req.files.profileimg.profileimageOriginalName;
         var profileimageName = req.files.profileimg.name;
         var profileimageMime = req.files.profileimg.mimetype;
         var profileimagePath = req.files.profileimg.path;
         var profileimageExt = req.files.profileimg.extension;
         var profileimageSize = req.files.profileimg.size;
     } else {
         var profileimageName = 'noimage.png';
     }*/

    //find validation
    req.checkBody('name', 'Name required').notEmpty();
    req.checkBody('email', 'email required').notEmpty();
    req.checkBody('email', 'email not valid').isEmail();
    req.checkBody('username', 'User Name required').notEmpty();
    req.checkBody('password', 'Password filed is empty').notEmpty();
    req.checkBody('password2', 'password does not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        });
    } else {
        var newUser = new username({
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2,
            //profileImg: profileImageName
        });
        //create user
        username.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });
        //Success msg
        req.flash('success', 'You are now registered');
        res.location('#');
        res.redirect('#');
    }
});
module.exports = router;