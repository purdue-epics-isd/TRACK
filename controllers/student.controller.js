const Student = require('../models/student.model');

exports.student_create = function (req, res) {
    let student = new Student(
        {   name: req.body.name,
            period: req.body.period,
            grade: req.body.grade,
            age: req.body.age,
            goals: []
        }
    );
    student.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            //res.send(student);
            res.redirect('/');
        }
    })
};

exports.student_details = function (req, res) {
    Student.findById(req.params.id, function (err, student) {
        //if (err) return next(err);
        if (err) return err;
        res.send(student);
    })
};

exports.student_name = function (req, res) {
    var students = [];

    Student.find({}, 'name', function(err, student) {
        student.forEach(function(s) { 
            console.log(s); console.log(s.name); 
            students.push(s);
        });
    });
    Student.findById(req.params.id, function(err, student) {
        res.render('pages/studentPage', {
            student: student
        });
    });
}


app.get(‘/logout’, function(req, res) {
   res.render(‘pages/logout’);
 });
}

exports.run = function(req, res) {
    /*var students = [];

    Student.find({}, 'name', function(err, student) {
        student.forEach(function(s) { 
            console.log(s); console.log(s.name); 
            students.push(s);
        });
        res.render('/login.html', {
            students: students
        });*/
        var path = require('path');
        res.sendFile(path.resolve(__dirname + '/../public/login.html'));
    /*});*/
}
