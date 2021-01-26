//add encryption tool:
var aesjs = require('aes-js');
var CryptoJS = require("crypto-js");
const User = require('../models/user.model');
const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const GoalData = require('../models/goaldata.model');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false); // solve findAndModify() warning

function encryption(string) {
    return ciphertext = CryptoJS.AES.encrypt(string, 'secret key 123').toString();
}
function decryption(ciphertext) {
    var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    return originalText = bytes.toString(CryptoJS.enc.Utf8);
}


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
    //encrytion ends here
    var CryptoJS = require("crypto-js");
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(req.body.name, 'secret key 123').toString();
    // Decrypt
    var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(req.body.methodOfCollection);
    try {
        //for name:
        let goal = new Goal(
            {
                name: encryption(req.body.name),
                description: encryption(req.body.description),
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                goalType: req.body.goalType,
                studentID: req.params.studentid,
                methodOfCollection: req.body.methodOfCollection,
                occurrencesType: req.body.occurrences,
                shared: false,
                rubricdescription: [req.body.Rnotevident,req.body.Rintroduced,req.body.Remerging,req.body.Rdeveloping,req.body.Rongoing, req.body.Rdemonstrated, req.body.Rapplied],
                goaldata: [],
                userid: req.body.userID
            })

        Student.findOneAndUpdate({_id: req.params.studentid}, {$push: {goals: goal}}, function (err, student) {
            goal.save(function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.redirect('/student/' + req.params.studentid);
                }
            });
        });
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
            if (err) {
                res.send(err);
                return;
            }

            User.findById(req.params.userid, function(err, user) {
                Goal.findById(req.params.goalid, function(err, goal) {
                    var methodsOfCollection = goal.methodOfCollection;

                    goal.name = decryption(goal.name);
                    goal.description = decryption(goal.description);
                    // goal.studentID = decryption(goal.studentID);
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
        return;
    } catch(error) {
        console.log("err:" + err);
        res.render('./error');
    }
}

/*deletes goal from database*/
//TODO: make sure to delete any corresponding goaldata as well
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

/*navigates user to EditGoal.ejs page */
exports.goal_redirect_edit = function (req, res) {
    try {
        User.findById(req.params.userid, function(err, user) {
            Student.findById(req.params.studentid, function(err, student) {
              Goal.findById(req.params.goalid, function(err, goal) {
                  goal.name = decryption(goal.name);
                  goal.description =decryption(goal.description);
                  goal.studentID = decryption(goal.studentID);
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

/*submits and updates any edits made to goal profile*/
exports.goal_edit = function (req, res) {
    console.log("Goal id: [edit]: " + req.params.goalid);
    Goal.findByIdAndUpdate(req.params.goalid,
            { $set: { name: req.body.name,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                goalType: req.body.goalType,
                occurrencesType: req.body.occurrences,
                rubricdescription: [req.body.Rnotevident,req.body.Rintroduced,req.body.Remerging,req.body.Rdeveloping,req.body.Rongoing, req.body.Rdemonstrated, req.body.Rapplied]
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
    var sharingemail = req.body.email.toLowerCase()
    console.log("goal.controller email in body:" + sharingemail); //testing to see if the user email is correctly being updated

    /*update the list of teacher's that current student is shared with*/
    Student.findById(req.params.studentid, function (err, student) {
        student.shared = true;
        var alreadyShared = false;
        for(var i=0;i<student.sharedWith.length;i++) {
            if(student.sharedWith[i] == sharingemail) {
                alreadyShared = true;
            }
        }
        if(!alreadyShared) student.sharedWith.push(sharingemail);
        student.save();
    });

    /*update the list of teacher's that current goal is shared with*/
    Goal.findById(req.params.goalid, function (err, goal) {
        goal.shared = true;
        var alreadyShared = false;
        for(var i=0;i<goal.sharedWith.length;i++) {
            if(goal.sharedWith[i] == sharingemail) {
                alreadyShared = true;
            }
        }
        if(!alreadyShared) goal.sharedWith.push(sharingemail);
        goal.save();
    });

    res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid);
}

/*redirects page to the "create new goal" page*/
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

/*redirects page to the student profile page, specifically for said students that are shared with a specified user*/
exports.navigate_to_sharedWithMeStudentProfile = function (req, res) {
    try {
        var goals = [];

        /*load all the goals that match the student id*/
        //TODO: we may need to add filtering (i.e. an if statement) to make sure that the goals are actually shared goals
        //Just because the student is shared, doesn't necessarily mean all of their goals should be shared
        Goal.find({studentID: req.params.studentid}, {}, function(err, goal) {
            goal.name = decryption(goal.name);
            goal.description = decryption(goal.description);
            goal.studentID = decryption(goal.studentID);
            goal.forEach(function(s) { 
                    goals.push(s);
                    console.log(s);
            });
        });

        /*load the actual page*/
        goals.name = decryption(goals.name);
        goals.description = decryption(goals.description);
        goals.studentID = decryption(goals.studentID);
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

/* renders shared goal page */
exports.navigate_to_sharedWithMeGoalProfile = function (req, res) {
    try {
        goalDatas = [];

        /*go through database to find all of the goal data that matches this specific goal*/
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
            User.findById(req.params.userid, function(err, user) {
                Goal.findById(req.params.goalid, function(err, goal) {
                    var methodsOfCollection = goal.methodOfCollection;
                    console.log("method:" + goal.methodOfCollection);
                    console.log("method as var:" + methodsOfCollection);
                    console.log("goal:" + goal);
                    gfs.files.find( { metadata: req.params.goalid } ).toArray((err, files) => {
                        goal.name = encryption(goal.name);
                        goal.description = encryption(goal.description);
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