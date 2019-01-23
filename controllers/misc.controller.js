const Student = require('../models/student.model');

exports.login = function (req, res) {
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
}

exports.logout = function (req, res) {
	res.render('pages/logout');
};