const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const GoalData = require('../models/goaldata.model');
const mongoose = require('mongoose');

/*creates a new goal in database*/
exports.goal_create = function (req, res) {
    let goal = new Goal(
        {
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            goalType: req.body.goalType,
            studentID: req.params.id,
            goaldata: []
            //support: req.body.support,
            //comments: req.body.comments,
        })

    Student.findOneAndUpdate({_id: req.params.id}, {$push: {goals: goal}}, function (err, student) {
        goal.save(function (err) { 
            if (err) {
                res.send(err);
            }
        });
    });
    res.redirect('/student/' + req.params.id);
};

/* renders goal page */
exports.navigate_to_goalProfile = function (req, res) {
    goalDatas = [];

    GoalData.find({goalID: req.params.goalid}, {}, function(err, goaldata) {
        goaldata.forEach(function(s) { 
            goalDatas.push(s);
        });
    });

    Student.findById(req.params.id, function(err, student) {
        Goal.findById(req.params.goalid, function(err, goal) {
            res.render('pages/goalProfile', {
                goalDatas: goalDatas,
                student: student,
                goal: goal
            });
        });
    })
}

/*deletes goal from database TODO: implement in actual website*/
exports.goal_delete = function (req, res) {
    console.log("Goal id: [delete]: " + req.params.goalid);
    Goal.findByIdAndRemove(req.params.goalid, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/student/' + req.params.id);
        }
    })
};

/*redirects page to the "create new goal" page, TODO: change function name to something more applicable*/
exports.navigate_to_createNewGoal = function (req, res) {
    Student.findById(req.params.id, function(err, student) {
        res.render('pages/createNewGoal');
    });
};