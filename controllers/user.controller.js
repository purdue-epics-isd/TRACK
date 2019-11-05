const User = require('../models/user.model');
var passport = require('passport');
var LocalStrategy   = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");


exports.createUser = function (req, res) {
User.register(new User({username:req.body.username}),req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render('pages/signupSuccess');
        } //user stragety
        passport.authenticate("local")(req, res, function(){
            res.render("pages/signupSuccess"); //once the user sign up
       }); 
    });
};

exports.login_confirm = function (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next (err); }
      return User.findById(req.params.userid, function(err, user) {
        res.render('/' + req.user.id + '/classPage', {
          user: user
        });
      });
    }) (req, res, next);
  });
}


/*
exports.login_confirm = passport.authenticate("local",{
   successRedirect: "/" + req.user.id + "/classPage",
    failureRedirect:"/"
}),function(req, res){
    res.send("User is "+ req.user.id);
};
*/

