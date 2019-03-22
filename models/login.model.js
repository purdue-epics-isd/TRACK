var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var UserSchema = new mongoose.Schema({
  
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});


//Hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('User', UserSchema);
module.exports = User;


