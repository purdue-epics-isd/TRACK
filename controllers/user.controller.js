const User = require('../models/login.model');


exports.signup = function (req, res) {
    try {
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
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};
