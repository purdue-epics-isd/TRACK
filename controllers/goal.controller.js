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

    Student.findOneAndUpdate({_id: req.params.id}, {$push: {goals: goal}}, function (err, student) {
            console.log("Student to be updated: " + student);
            console.log("goal to be added: " + goal);
        });
        /*student: student;
        student.update (
            {$push: {goals: goal}}
        )}*/
    //console.log("student 2.0:" + student);
    /*student.save(function (err) {
        if(err) {
            res.send(err);
        }
    });*/

    goal.save(function (err) { 
        if (err) {
            res.send(err);
        }
    });

    var goals = [];

    Goal.find({}, {}, function(err, goal) {
        goal.forEach(function(s) { 
            console.log("s.studentID: " + s.studentID);
            console.log("req.params.id: " + req.params.id);
            if (s.studentID == req.params.id) {
                //console.log(s); console.log(s.name); 
                goals.push(s);
            }
        });
    });

    Student.findById(req.params.id, function(err, student) {
        console.log(student.goals);
        console.log(goals);
        res.render('pages/studentPage', {
            student: student,
            goals: goals
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

/* renders goal page */
exports.goalProfileNavigation = function (req, res) {
    Student.findById(req.params.id, function(err, student) {
        Goal.findById(req.params.goalid, function(err, goal) {
            res.render('pages/goalPage', {
                student: student,
                goal: goal
            });
            //console.log("Student: " + student);
            console.log("Goal: " + goal);
        });
    })
}

/*deletes goal from database TODO: implement in actual website*/
exports.goal_delete = function (req, res) {
    console.log(req.params.goalid)
    Goal.findByIdAndRemove(req.params.goalid, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

/*redirects page to the "create new goal" page, TODO: change function name to something more applicable*/
exports.newGoalNavigation = function (req, res) {
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