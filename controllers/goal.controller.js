const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const mongoose = require('mongoose');

exports.goal_create = function (req, res) {
    Student.findById(req.params.id, function(err, student) {
            student: student
            //console.log(student);
            console.log("StudentID: " + req.params.id);

    });

    let goal = new Goal(
        {
            name: req.body.name,
            description: req.body.description,
            studentID: req.params.id,
            percentage: req.body.percentagename
            //support: req.body.support,
            //comments: req.body.comments,
        })

    Student.findById(req.params.id, function (err, student) {
    //student = student[0];
    //student.name = student.name;
    //student.period = student.period;
    //student.grade = student.grade;
    //student.age = student.age;
    student: student
    /*console.log("Student update -");
    console.log("student: " + student);
    console.log("goal: " + goal);*/
    student.goals = goal;
    //console.log("student 2.0:" + student);
    student.save(function (err) {
        if(err) {
            res.send(err);
        }
    });

    goal.save(function (err) {
        if(err) {
            res.send(err);
        }
    });
});

    goal.save(function (err) {
        if (err) {
            res.send(err);
        } else {

            Student.findById(req.params.id, function(err, student) {
                console.log(student.goals);
                /*
                Student.find({}, 'goals', function(err, student) {
                    Student.goals.forEach(function(s) { 
                    console.log(s);
            });*/
/*
        });*/
                //Student.goals = goal;
                res.render('pages/studentPage', {
                    student: student
                });
           });
        }});
}


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