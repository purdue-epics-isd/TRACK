const Student = require('../models/student.model');

/* TODO: authenticate login and change URL name when it redirects to the classpage*/
exports.login = function (req, res) {
    try {
        var students = [];
        User.findById(req.params.userid, function(err, user) {
            Student.find({}, 'name', function(err, student) {
                student.forEach(function(s) { 
                    if(student.userid==req.params.userid) {
                    console.log(s); console.log(s.name); 
                    students.push(s);
                }
                });
            });
        });
        User.findById(req.params.userid, function(err, user) {
            Student.findById(req.params.studentid, function(err, student) {
                res.render('pages/classPage', {
                    students: students,
                    user: user
                });
            });
        });
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
}

/* TODO: actually log out */
exports.logout = function (req, res) {
    var logout = true;
    try {
	   res.render('pages/index', {
        logout: logout
    });
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};

