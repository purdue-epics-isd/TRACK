const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const mongoose = require('mongoose');

/*creates a new goal in database*/
exports.goal_create = function (req, res) {
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
        student: student
        student.update (
            {$push: {goals: goal}}
        )
        //console.log("student 2.0:" + student);
        student.save(function (err) {
            if(err) {
                res.send(err);
            }
        });

        goal.save(function (err) { 
            if (err) {
                res.send(err);
            } else {
                Student.findById(req.params.id, function(err, student) {
                    console.log(student.goals);
                    res.render('pages/studentPage', {
                        student: student
                    });
                });
            };
        });
    });
};


/*TODO: figure out what this does*/
exports.goal_details = function (req, res) {
    Goal.findById(req.params.id, function (err, goal) {
        if (err) return next(err);
        res.send(goal);
    })
};

/* renders goal page TODO: change function name to something more applicable*/
exports.goal_name = function (req, res) {
    Student.findById(req.params.id, function(err, goal) {
        var student = student
    })
    Goal.findById(req.params.id, function(err, goal) {
        res.render('pages/goalPage', {
            goal: goal,
            student: student
        });
    });
}

/*deletes goal from database TODO: implement in actual website*/
exports.goal_delete = function (req, res) {
    console.log(req.body.id)
    Goal.findByIdAndRemove(req.body.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

/*redirects page to the "create new goal" page, TODO: change function name to something more applicable*/
exports.goal_new = function (req, res) {
    Student.findById(req.params.id, function(err, student) {
        //console.log(req.Student.id);
        var path = require('path');
        res.sendFile(path.resolve(__dirname + '/../public/newgoal.html'));//TODO: change path to .ejs file
        //res.sendFile('../newgoal.html');
    });
    /*console.log(req.Student.id)
        res.redirect('/newGoal.html', {
            //student: student
        });*/
};