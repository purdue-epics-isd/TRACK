const Student = require('../models/student.model');

exports.student_create = function (req, res) {
    let student = new Student(
        {
            name: req.body.name,
            price: req.body.price
        }
    );

    student.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Student Created successfully')
    })
};

exports.student_details = function (req, res) {
    Student.findById(req.params.id, function (err, student) {
        if (err) return next(err);
        res.send(student);
    })
};