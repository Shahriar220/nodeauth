var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserbyID(id, function(err, user) {
        done(err, user);
    });
});
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(error, user) {
            if (err) throw err;
            if (!user) {
                console.log('unknown');
                return done(null, false, { message: 'Unknown' });
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    console.log('invalid password');
                    return done(null, false, { message: 'invalid password' });
                }
            })
        });
    }
));

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureflash: 'invalid username or password' }), function(req, res) {
    console.log('authentication suceessful');
    req.flash('success', 'logged in ');
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout;
    req.flash('success', 'you have logged out');
    res.redirect('/users/login');
});
module.exports = router;