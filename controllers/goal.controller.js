const User = require('../models/user.model');
const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const GoalData = require('../models/goaldata.model');
const mongoose = require('mongoose');

/*creates a new goal in database*/
exports.goal_create = function (req, res) {
    try {
        let goal = new Goal(
            {
                name: req.body.name,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                goalType: req.body.goalType,
                studentID: req.params.studentid,
                methodOfCollection: req.body.methodOfCollection,
                occurrencesType: req.body.occurrences,
                goaldata: []
            })

        Student.findOneAndUpdate({_id: req.params.studentid}, {$push: {goals: goal}}, function (err, student) {
            goal.save(function (err) {
                if (err) {
                    res.send(err);
                }
                else
                {
                    res.redirect('/student/' + req.params.studentid);
                }
            });
        });

        /*let sleep = ms => new Promise(resolve => setTimeout(resolve, ms)); //sleep to make sure that everything loads properly
        async function init() {
            await sleep(10);
        }
        init();
        //res.redirect('/student/' + req.params.studentid);*/
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


        Student.findById(req.params.studentid, function(err, student) {
            //console.log(err);
            if (err) {
                //console.log(err);
                res.send(err);
                return;
            }

            User.findById(req.params.userid, function(err, user) {
                Goal.findById(req.params.goalid, function(err, goal) {
                    var methodsOfCollection = goal.methodOfCollection;
                    console.log("method:" + goal.methodOfCollection);
                    console.log("method as var:" + methodsOfCollection);
                    console.log("goal:" + goal);
                    res.render('pages/goalProfile', {
                        user: user,
                        goalDatas: goalDatas,
                        student: student,
                        goal: goal,
                        methodOfCollection: methodsOfCollection
                    });
                });
            });
        });
        //console.log("pls workmaybe");
        return;
    } catch(error) {
        console.log("err:" + err);
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
                res.redirect('/student/' + req.params.studentid);
            }
        })
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};

exports.goal_redirect_edit = function (req, res) {
    try {
        User.findById(req.params.userid, function(err, user) {
            Student.findById(req.params.studentid, function(err, student) {
              Goal.findById(req.params.goalid, function(err, goal) {
                res.render('pages/EditGoal', {
                    student: student,
                    user: user,
                    goalid: req.params.goalid,
                    goal: goal
                });
            });
          });
        });

    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};

exports.goal_edit = function (req, res) {
    console.log("Goal id: [edit]: " + req.params.goalid);
    Goal.findByIdAndUpdate(req.params.goalid,
        { $set: { name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            goalType: req.body.goalType
             } }, function (err) {
          if (err) {
            console.log(err);
          }
          else {
            res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid);
          }
        });
}

exports.goal_share = function (req, res) {
    Goal.findByIdAndUpdate(req.params.goalid,
        { $set: { 
             } }, function (err) {
          if (err) {
            console.log(err);
          }
          else {
            res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid);
          }
        });
}

/*redirects page to the "create new goal" page, TODO: change function name to something more applicable*/
exports.navigate_to_createNewGoal = function (req, res) {
    try {
            User.findById(req.params.userid, function(err, user) {
            Student.findById(req.params.studentid, function(err, student) {
                res.render('pages/createNewGoal', {
                    student: student,
                    user: user
                });
            });
        });
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};
