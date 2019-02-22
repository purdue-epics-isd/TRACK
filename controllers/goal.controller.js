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
            studentID: req.params.id,
            percentage: req.body.percentagename,
            goaldata: []
            //support: req.body.support,
            //comments: req.body.comments,
        })

    Student.findOneAndUpdate({_id: req.params.id}, {$push: {goals: goal}}, function (err, student) {
        //console.log("Student to be updated: " + student);
        //console.log("goal to be added: " + goal);
        goal.save(function (err) { 
            if (err) {
                res.send(err);
            }
        });
    });
    res.redirect('/student/' + req.params.id);
};


/*TODO: figure out what this does*/
/*exports.goal_details = function (req, res) {
    Goal.findById(req.params.id, function (err, goal) {
        if (err) return next(err);
        res.send(goal);
    })
};*/

/* renders goal page */
exports.navigate_to_goalProfile = function (req, res) {
    goalDatas = [];
    //console.log("goalID: " + GoalData.goalID);
    //console.log("req.params.goalid: " + req.params.goalid);

    GoalData.find({goalID: req.params.goalid}, {}, function(err, goaldata) {
        goaldata.forEach(function(s) { 
            //console.log("LETS ADD SOME GOAL DATA");
            //console.log("goaldata.goalID: " + s.goalID);
            //sconsole.log("goaldata: " + s);
            //console.log("goaldata: " + req.params.id);
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
            //console.log("Student: " + student);
            //console.log("Goaldatas: " + goalDatas);
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
        //console.log(req.Student.id);
        /*var path = require('path');
        res.sendFile(path.resolve(__dirname + '/../public/newgoal.html'));//TODO: change path to .ejs file*/
        //res.sendFile('../newgoal.html');
    });
    /*console.log(req.Student.id)
        res.redirect('/newGoal.html', {
            //student: student
        });*/
};