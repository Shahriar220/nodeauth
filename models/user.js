var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

var db = mongoose.connection;

//user schema

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    email: {
        type: String,
    },
    name: {
        type: String
    }
});
var User = module.exports = mongoose.model('User', UserSchema);
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.getUserbyUserbyUsername = function(username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}
module.exports.getUserbyID = function(id, callback) {

    User.findById(id, callback);
}

module.exports.createUser = function(newUser, callback) {
    bcrypt.hash(newUser.password, 10, function(err, hash) {
        if (err) throw err;
        //set hash password
        newUser.password = hash;
        newUser.save(callback);
    });
}