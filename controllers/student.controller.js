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
        } /*else {
            var goals = [];

            Student.findById(student.id, function(err, student) {
                res.render('pages/studentProfile', {
                    student: student,
                    goals: goals
                });
           });
        }*/
    })
    res .redirect("/classPage");
};

/*TODO: figure out what this does*/
/*exports.student_details = function (req, res) {
    Student.findById(req.params.id, function (err, student) {
        //if (err) return next(err);
        if (err) return err;
        res.send(student);
    })
};
*/

/*redirects to student Page*/
exports.navigate_to_studentProfile = function (req, res) {
    var goals = [];

    Goal.find({studentID: req.params.id}, {}, function(err, goal) {
        goal.forEach(function(s) { 
            console.log("s.studentID: " + s.studentID);
            console.log("req.params.id: " + req.params.id);
            goals.push(s);
        });
    });

    Student.findById(req.params.id, function(err, student) {
        Goal.findById(req.params.goalid, function(err, goal) {
            res.render('pages/studentProfile', {
                goals: goals,
                student: student
            });
        });
    });
}

/*redirects to class page*/
exports.navigate_to_classPage = function (req, res) {
    var students = [];

    Student.find({}, {}, function(err, student) {
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
exports.navigate_to_createNewStudent = function (req, res) {
    //var students = [];

    /*Student.find({}, 'name', function(err, student) {
        student.forEach(function(s) { 
            console.log(s); console.log(s.name); 
            students.push(s);
        });
    });*/
    Student.findById(req.params.id, function(err, student) {
        res.render('pages/createNewStudent', {
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
