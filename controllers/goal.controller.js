const User = require('../models/user.model');
const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const GoalData = require('../models/goaldata.model');
const mongoose = require('mongoose');
// Require packages
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

let gfs;
let db = mongoose.connection;
db.once('open', () => {
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
});

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
                shared: false,
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
                    gfs.files.find( { metadata: req.params.goalid } ).toArray((err, files) => {
                      if (!files || files.length === 0) {
                        res.render('pages/goalProfile', {
                            user: user,
                            goalDatas: goalDatas,
                            student: student,
                            goal: goal,
                            methodOfCollection: methodsOfCollection,
                            shared: false,
                            files: false
                        });
                      } else {
                        files.map((file) => {
                          (file.contentType === 'image/jpeg' || file.contentType === 'image/png') ? file.isImage = true : file.isImage = false;
                        });         
                        res.render('pages/goalProfile', {
                            user: user,
                            goalDatas: goalDatas,
                            student: student,
                            goal: goal,
                            methodOfCollection: methodsOfCollection,
                            shared: false,
                            files: files
                        });
                      }
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

/*shares goals with other teachers*/
exports.goal_share = function (req, res) {
    Student.findById(req.params.studentid, function (err, student) {
        student.shared = true;
        var alreadyShared = false;
        for(var i=0;i<student.sharedWith.length;i++) {
            if(student.sharedWith[i] == req.body.email) {
                alreadyShared = true;
            }
        }
        if(!alreadyShared) student.sharedWith.push(req.body.email);
        student.save();
    });

    Goal.findById(req.params.goalid, function (err, goal) {
        goal.shared = true;
        var alreadyShared = false;
        for(var i=0;i<goal.sharedWith.length;i++) {
            if(goal.sharedWith[i] == req.body.email) {
                alreadyShared = true;
            }
        }
        if(!alreadyShared) goal.sharedWith.push(req.body.email);
        goal.save();
    });

    res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid);
/*
    Student.findByIdAndUpdate(req.params.studentid, { $set: {shared:true}, $push: {sharedWith: req.body.email}}, function (err) {
          if (err) {
            console.log(err);
          }
          else {
          }
    });
    */
    /*
    Goal.findByIdAndUpdate(req.params.goalid, { $set: {shared:true}, $push: {sharedWith: req.body.email}}, function (err) {
          if (err) {
            console.log(err);
          }
          else {
            console.log("\nSHARING GOAL...")
            console.log("\nGoal id:" + req.params.goalid);
            console.log("\nSharing with:" + req.body.email);
            res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid);
          }
    });
    */
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

exports.navigate_to_sharedWithMeStudentProfile = function (req, res) {
    try {
        var goals = [];

        Goal.find({studentID: req.params.studentid}, {}, function(err, goal) {
            goal.forEach(function(s) { 
                    goals.push(s);
                    console.log(s);
            });
        });

        User.findById(req.params.userid, function(err, user) {
            Student.findById(req.params.studentid, function(err, student) {
                Goal.findById(req.params.goalid, function(err, goal) {
                    res.render('pages/sharedWithMeStudentProfile', {
                        goals: goals,
                        student: student, 
                        user: user
                    });
                });
            });
        });
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
}

/* renders goal page */
exports.navigate_to_sharedWithMeGoalProfile = function (req, res) {
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
                    gfs.files.find( { metadata: req.params.goalid } ).toArray((err, files) => {
                      if (!files || files.length === 0) {
                        res.render('pages/sharedWithMeGoalProfile', {
                            user: user,
                            goalDatas: goalDatas,
                            student: student,
                            goal: goal,
                            methodOfCollection: methodsOfCollection,
                            shared: true,
                            files: false
                        });
                      } else {
                        files.map((file) => {
                          (file.contentType === 'image/jpeg' || file.contentType === 'image/png') ? file.isImage = true : file.isImage = false;
                        });         
                        res.render('pages/sharedWithMeGoalProfile', {
                            user: user,
                            goalDatas: goalDatas,
                            student: student,
                            goal: goal,
                            methodOfCollection: methodsOfCollection,
                            shared: true,
                            files: files
                        });
                      }
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