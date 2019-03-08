const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const GoalData = require('../models/goaldata.model');
const mongoose = require('mongoose');

/*creates a new goal in database*/
exports.goal_create = function (req, res) {
    collectionMethod = [];
    console.log("Let's make a goal!");
    console.log("req.body.name: " + req.body.name);
    console.log("req.body.singlePoint.name: " + req.body.singlePoint.name);
    console.log("req.body.singlePoint.value: " + req.body.singlePoint.value);
    console.log("req.body.rubric: " + req.body.rubric);
    console.log("req.body.rubric.value: " + req.body.rubric.value);
    console.log("req.body.comments: " + req.body.comments);
    console.log("req.body.comments.value: " + req.body.comments.value);
    if(req.body.singlePoint.checked == true) {
        console.log('I am check');
        collectionMethod = "singlePoint";
    }

    let goal = new Goal(
        {
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            goalType: req.body.goalType,
            studentID: req.params.id,
            collectionMethod: collectionMethod,
            goaldata: []
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