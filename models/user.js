var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({});

//plugin adds username, hash and salt for password
User.plugin(passportLocalMongoose); 

module.exports = mongoose.model('User', User);
