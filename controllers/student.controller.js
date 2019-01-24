const Student = require('../models/student.model');
const Goal = require('../models/goal.model');

/*creates new student profile in database*/
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
            res.render('pages/classPage');//TODO: render students with the classPage OR figure out how to call the /classPage function in the router file
            //res.run("/classPage");
        }
    })
};

/*TODO: figure out what this does*/
exports.student_details = function (req, res) {
    Student.findById(req.params.id, function (err, student) {
        //if (err) return next(err);
        if (err) return err;
        res.send(student);
    })
};

/*redirects to student Page TODO: update function name to something more applicable*/
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

/*redirects to class page*/
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

/*redirects to new student page*/
exports.new_student = function (req, res) {
    //var students = [];

    /*Student.find({}, 'name', function(err, student) {
        student.forEach(function(s) { 
            console.log(s); console.log(s.name); 
            students.push(s);
        });
    });*/
    Student.findById(req.params.id, function(err, student) {
        res.render('pages/newStudent', {
            //students: students
        });
    });
}

/*first function used when website starts up*/
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
