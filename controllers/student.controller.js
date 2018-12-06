const Student = require('../models/student.model');

exports.student_create = function (req, res) {
    let student = new Student(
        {
            name: req.body.name,
            period: req.body.period,
            grade: req.body.grade,
            age: req.body.age
        }
    );
    student.save(function (err) {
        if (err) {
            if(err)
            res.send(err);
        } else {
            res.send(student);
            //res.redirect('/classPage.html');
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

exports.run = function(req, res) {
    var students = [];
    console.log("running");

    Student.find({}, {name: 1, period: 0, grade: 0, age: 0}).forEach(function(err, student) {
    for (var key in student){ 
        if(students.indexOf(key) < 0) {
           students.push(key);
        }
    }
    res.render('pages/classPage', {
        students: students
    });
    console.log(students);
});
}
