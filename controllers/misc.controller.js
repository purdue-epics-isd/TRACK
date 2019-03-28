const Student = require('../models/student.model');

/* TODO: authenticate login and change URL name when it redirects to the classpage*/
exports.login = function (req, res) {
    try {
        var students = [];

        Student.find({}, 'name', function(err, student) {
            student.forEach(function(s) { 
                console.log(s); console.log(s.name); 
                students.push(s);
            });
        });
        
        Student.findById(req.params.id, function(err, student) {
            res.render('pages/classPage', {
                students: students
            });
        });
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
}

/* TODO: actually log out */
exports.logout = function (req, res) {
    try {
	   res.render('pages/logout');
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};

