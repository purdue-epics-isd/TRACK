const User = require('../models/login.model');
var passport = require('passport');
var LocalStrategy   = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");


exports.creatUser = function (req, res) {
User.register(new User({username:req.body.username}),req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render('pages/signup');
        } //user stragety
        passport.authenticate("local")(req, res, function(){
            res.redirect("/"); //once the user sign up
       }); 
    });
};


exports.login_confirm = passport.authenticate("local",{
   successRedirect:"/userfile",
    failureRedirect:"/"
}),function(req, res){
    res.send("User is "+ req.user.id);
};

