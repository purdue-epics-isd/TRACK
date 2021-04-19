//add encryption tool:
var aesjs = require('aes-js');
var CryptoJS = require("crypto-js");
const User = require('../models/user.model');
const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
const GoalData = require('../models/goaldata.model');
const mongoose = require('mongoose');
var sha256 = require('js-sha256');

mongoose.set('useFindAndModify', false); // solve findAndModify() warning

// encryption functions
function encryption(string) {
    return ciphertext = CryptoJS.AES.encrypt(string, 'secret key 123').toString();
}
function decryption(ciphertext) {
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    return originalText = bytes.toString(CryptoJS.enc.Utf8);
}

//converts the date to YYYY-MM-DD
function convertToYYYYMMDD(d) {
    if (d.substring(4, 5) != "-" || d.substring(11, 12) == "T") {
        date = new Date(d);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        dt = date.getDate();
        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        if (year != NaN) {
            var format = String(year) + '-' + String(month) + '-' + String(dt);
        } else {
            var format = "";
        }
        return format;
    }
    else {
        return d;
    }


}

/*creates a new goal in database*/
exports.goal_create = async function (req, res) {
    //encrytion ends here
    var CryptoJS = require("crypto-js");
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(req.body.name, 'secret key 123').toString();
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    // console.log(req.body.methodOfCollection);

    //Converting date to YYYY-MM-DD
    if (req.body.startDate != NaN) {
        req.body.startDate = convertToYYYYMMDD(req.body.startDate);
    }
    if (req.body.endDate != NaN) {
        req.body.endDate = convertToYYYYMMDD(req.body.endDate);
    }

    try {
        //for name:
        let goal = new Goal(
            {
                name: await encryption(req.body.name),
                description: await encryption(req.body.description),
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                goalType: req.body.goalType,
                studentID: req.params.studentid,
                methodOfCollection: req.body.methodOfCollection,
                occurrencesType: req.body.occurrences,
                shared: false,
                rubricdescription: [req.body.Rnotevident, req.body.Rintroduced, req.body.Remerging, req.body.Rdeveloping, req.body.Rongoing, req.body.Rdemonstrated, req.body.Rapplied],
                goaldata: [],
                userid: req.body.userID
            })

        Student.findOneAndUpdate({ _id: req.params.studentid }, { $push: { goals: goal } }, function (err, student) {
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
        res.render('pages/error');
    };
};

/* renders goal page */
exports.navigate_to_goalProfile = async function (req, res) {
    // await console.log("navigate_to_goalProfile");
    try {
        goalDatas = [];

        await GoalData.find({ goalID: req.params.goalid }, {}, async function (err, goaldata) {
            if (err) {
                await res.send(err);
                return;
            }
            await goaldata.forEach(async function (s) {
                // console.log("goaldata pre decrypt", s)
                console.log("s.comments", s.comments);
                console.log("s.teacherEmail", s.teacherEmail);
                console.log("s.filename", s.filename);
                s.comments = await decryption(s.comments);
                s.teacherEmail = s.teacherEmail;
                s.filename = s.filename;
                s.file = s.file;
                await console.log("s.comments", s.comments);
                await console.log("s.teacherEmail", s.teacherEmail);
                await console.log("s.filename", s.filename);
                // console.log("goaldata post decrypt", s)
                await goalDatas.push(s);
                // await console.log(s)


            });
        }).then(() => {
            Student.findById(req.params.studentid, async function (err, student) {
                if (err) {
                    await res.send(err);
                    return;
                }

                await User.findById(req.params.userid, async function (err, user) {
                    await Goal.findById(req.params.goalid, async function (err, goal) {
                        var methodsOfCollection = goal.methodOfCollection;
                        // console.log("goal pre decrypt", goal)
                        goal.name = await decryption(goal.name);
                        goal.description = await decryption(goal.description);
                        goal.userid = goal.userid;
                        // console.log("goal post decrypt", goal)
                        // goal.studentID = decryption(goal.studentID);
                        // await console.log("method:" + goal.methodOfCollection);
                        // await console.log("method as var:" + methodsOfCollection);

                        // await console.log("goal:" + goal);
                        // await console.log(req.params.goalid);

                        await res.render('pages/goalProfile', {
                            user: user,
                            goalDatas: goalDatas,
                            student: student,
                            goal: goal,
                            methodOfCollection: methodsOfCollection,
                            shared: false,
                            files: false
                        });

                    });
                });
            });
        });





        return;
    } catch (error) {
        await console.log("err:" + err);
        await res.render('pages/error');
    }
}


/*deletes goal from database*/
//TODO: make sure to delete any corresponding goaldata as well
exports.goal_delete = function (req, res) {
    try {
        // console.log("Goal id: [delete]: " + req.params.goalid);
        Goal.findByIdAndRemove(req.params.goalid, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/student/' + req.params.studentid);
            }
        })
    } catch (err) {
        console.log(err);
        res.render('pages/error');
    }
};

/*navigates user to EditGoal.ejs page */
exports.goal_redirect_edit = async function (req, res) {
    try {

        User.findById(req.params.userid, function (err, user) {
            Student.findById(req.params.studentid, function (err, student) {
                Goal.findById(req.params.goalid, async function (err, goal) {
                    // console.log("goal pre decrypt", goal)
                    goal.name = await decryption(goal.name);
                    goal.description = await decryption(goal.description);
                    goal.userid = goal.userid
                    // console.log("goal post decrypt", goal)

                    res.render('pages/EditGoal', {
                        student: student,
                        user: user,
                        goalid: req.params.goalid,
                        goal: goal
                    });
                });
            });
        });

    } catch (err) {
        console.log(err);
        res.render('pages/error');
    }
};

/*submits and updates any edits made to goal profile*/
exports.goal_edit = async function (req, res) {
    //Converting date to YYYY-MM-DD
    if (req.body.startDate != NaN) {
        req.body.startDate = convertToYYYYMMDD(req.body.startDate);
    }
    if (req.body.endDate != NaN) {
        req.body.endDate = convertToYYYYMMDD(req.body.endDate);
    }

    let newName = await encryption(req.body.name)
    let newDescr = await encryption(req.body.description)
    // console.log("Goal id: [edit]: " + req.params.goalid);
    Goal.findByIdAndUpdate(req.params.goalid, 

        {
            $set: {
                name: newName,
                description: newDescr,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                goalType: req.body.goalType,
                occurrencesType: req.body.occurrences,
                rubricdescription: [req.body.Rnotevident, req.body.Rintroduced, req.body.Remerging, req.body.Rdeveloping, req.body.Rongoing, req.body.Rdemonstrated, req.body.Rapplied]
            }
        }, function (err) {
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
        for (var i = 0; i < student.sharedWith.length; i++) {
            if (student.sharedWith[i] == sharingemail) {
                alreadyShared = true;
            }
        }
        if (!alreadyShared) student.sharedWith.push(sharingemail);
        student.save();
    });

    /*update the list of teacher's that current goal is shared with*/
    Goal.findById(req.params.goalid, function (err, goal) {
        goal.shared = true;
        var alreadyShared = false;
        for (var i = 0; i < goal.sharedWith.length; i++) {
            if (goal.sharedWith[i] == sharingemail) {
                alreadyShared = true;
            }
        }
        if (!alreadyShared) goal.sharedWith.push(sharingemail);
        goal.save();
    });

    res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid);
}

/*redirects page to the "create new goal" page*/
exports.navigate_to_createNewGoal = function (req, res) {
    try {
        User.findById(req.params.userid, function (err, user) {
            Student.findById(req.params.studentid, function (err, student) {
                res.render('pages/createNewGoal', {
                    student: student,
                    user: user
                });
            });
        });
    } catch (err) {
        console.log(err);
        res.render('pages/error');
    }
};

// redirectes page to the "goalInfo" page
exports.navigate_to_goalInfo = async function (req, res) {
    try {
        User.findById(req.params.userid, function (err, user) {
            Student.findById(req.params.studentid, function (err, student) {
                Goal.findById(req.params.goalid, async function (err, goal) {
                    // console.log("goal pre decrypt", goal)
                    goal.name = await decryption(goal.name);
                    goal.description = await decryption(goal.description);
                    goal.userid = goal.userid
                    // console.log("goal post decrypt", goal)

                    res.render('pages/goalInfo', {
                        student: student,
                        user: user,
                        goalid: req.params.goalid,
                        goal: goal
                    });
                });
            });
        });
    } catch (err) {
        console.log(err);
        res.render('pages/error');
    }
};