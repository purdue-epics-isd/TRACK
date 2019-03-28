const User = require('../models/login.model');

exports.createUser = function (req, res) {
	console.log("Signning up for new user");
    let  user = new User(
        {   username: req.body.username,
            password: req.body.password
        }
    );
    user.save(function (err) {
        if (err) {
            res.send(err);
        } 
    })
    res.redirect("/");

};



