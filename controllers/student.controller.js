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
    var ids = [];
    console.log("running");

    Student.find({}, 'name', function(err, student) {
        student.forEach(function(s) { 
            console.log(s); console.log(s.name); 
            students.push(s.name);
            ids.push(s.id);
        });
        console.log(students);
    console.log(ids);
    res.render('pages/classPage', {
        students: students
        //ids: ids
    });

});
}
