const Student = require('../models/student.model');
const Goal = require('../models/goal.model');

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
            res.render('pages/classPage');
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
    //var students = [];
/*
    Student.find({}, 'name', function(err, student) {
        student.forEach(function(s) { 
            console.log(s); console.log(s.name); 
            students.push(s);
        });
    });*/
    var goals = [];

    Goal.find({}, 'name', function(err, goal) {
        goal.forEach(function(s) { 
            if (goal.studentID = req.params.id) {
            console.log(s); console.log(s.name); 
            goals.push(s);
            }
        });
    });

    Student.findById(req.params.id, function(err, student) {
        Goal.findById(req.params.id, function(err, goal) {
            res.render('pages/studentPage', {
                goals: goals,
                student: student
            });
        });
    });
}

exports.class_page = function (req, res) {
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
            res.render('pages/login');
    /*});*/
}
