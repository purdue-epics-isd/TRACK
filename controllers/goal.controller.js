const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const GoalData = require('../models/goaldata.model');
const mongoose = require('mongoose');

/*creates a new goal in database*/
exports.goal_create = function (req, res) {
    try {
        /*console.log("Let's make a goal!");
        console.log("req.body.name: " + req.body.name);*/
        //console.log("req.body.singlePoint.checked: " + req.body.singlePoint.checked);
        console.log("req.body.methodOfCollection: " + req.body.methodOfCollection);
        //console.log("req.body.singlePoint.name: " + req.body.singlePoint.name);
        //console.log("req.body.singlePoint.value: " + req.body.singlePoint.value);
        //console.log("req.body.rubric: " + req.body.rubric);
        //console.log("req.body.goalType: " + req.body.goalType);
        /*console.log("req.body.rubric.value: " + req.body.rubric.value);
        console.log("req.body.comments: " + req.body.comments);
        console.log("req.body.comments.value: " + req.body.comments.value);*/

        let goal = new Goal(
            {
                name: req.body.name,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                goalType: req.body.goalType,
                studentID: req.params.id,
                methodOfCollection: req.body.methodOfCollection,
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
    } catch (err) {
        console.log(err);
        res.render('./error');
    };
};

/* renders goal page */
exports.navigate_to_goalProfile = function (req, res) {
    try {
        goalDatas = [];

        GoalData.find({goalID: req.params.goalid}, {}, function(err, goaldata) {
            if (err) {
                res.send(err);
                return;
            }
            goaldata.forEach(function(s) { 
                goalDatas.push(s);
            });
        });


        Student.findById(req.params.id, function(err, student) {
            console.log(err);
            if (err) {
                //console.log(err);
                res.send(err);
                return;
            }
            Goal.findById(req.params.goalid, function(err, goal) {
                //console.log(goal.methodOfCollection);
                //console.log(goal);
                if (err) {
                    //console.log(err);
                    res.send(err);
                    return;
                }
                //console.log(goal);
                //console.log("not broken yet");
                res.render('pages/goalProfile', {
                    goalDatas: goalDatas,
                    student: student,
                    goal: goal,
                    methodOfCollection: goal.methodOfCollection
                });
            });
        });
        //console.log("pls workmaybe");
        return;
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
}

/*deletes goal from database*/
exports.goal_delete = function (req, res) {
    try {
        console.log("Goal id: [delete]: " + req.params.goalid);
        Goal.findByIdAndRemove(req.params.goalid, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/student/' + req.params.id);
            }
        })
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};

/*redirects page to the "create new goal" page, TODO: change function name to something more applicable*/
exports.navigate_to_createNewGoal = function (req, res) {
    try {
        Student.findById(req.params.id, function(err, student) {
            res.render('pages/createNewGoal', {
                student: student
            });
        });
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};