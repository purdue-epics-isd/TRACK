const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const mongoose = require('mongoose');

exports.goal_create = function (req, res) {
    var Student = mongoose.model('Student');
    Student.findById(req.params.id, function(err, goal) {
        var student = student;
        //console.log(req.body.id);
        console.log(student);
    })

    let goal = new Goal(
        {
            name: req.body.name,
            description: req.body.description,
            studentID: req.body.studentID,
            percentage: req.body.percentagename,
            //support: req.body.support,
            //comments: req.body.comments,
        }
    );

    goal.save(function (err) {
        if (err) {
            res.send(err);
            //console.log('Success!');
        } else {
            res.send(goal);
        }
    });

    // create a comment
   // Student.findById(req.params.id, function(err, goal) {
        //Student.goals.push(goal);
    //})
    var subdoc = Student.findById(req.params.id, function(err, goal) {
        goal[0];
    })
    //console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
    subdoc.isNew; // true
};

exports.goal_details = function (req, res) {
    Goal.findById(req.params.id, function (err, goal) {
        if (err) return next(err);
        res.send(goal);
    })
};

exports.goal_name = function (req, res) {
    Student.findById(req.params.id, function(err, goal) {
        var student = student
    })
    Goal.findById(req.params.id, function(err, goal) {
        res.render('pages/goalPage', {
            goal: goal
            //student: student
        });
    });
}

exports.goal_delete = function (req, res) {
    console.log(req.body.id)
    Goal.findByIdAndRemove(req.body.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.goal_new = function (req, res) {
    Student.findById(req.params.id, function(err, student) {
        //console.log(req.Student.id);
        var path = require('path');
        res.sendFile(path.resolve(__dirname + '/../public/newgoal.html'));
        //res.sendFile('../newgoal.html');
    });
    /*console.log(req.Student.id)
        res.redirect('/newGoal.html', {
            //student: student
        });*/
};