const Student = require('../models/student.model');
const Goal = require('../models/goal.model');
const User = require('../models/user.model');
var CryptoJS = require("crypto-js");
/*creates new student profile in database*/
exports.student_create = function (req, res) {
    try {
        let student = new Student(
            {   firstname: req.body.firstname,
                lastname: req.body.lastname,
                grade: req.body.grade,
                dob: req.body.dob,
                email: req.body.studentemail,
                goals: [],
                userid: req.body.userID,
                shared: false
            }
        );
        student.save(function (err) {
            if (err) {
                console.log(err);
            } 
        })
        res.redirect("/classPage");
    } catch(err) {
        //console.log(err);
        console.log("exports.student_create");
        res.render('./error');
    }
};


function decryption(ciphertext) {
    var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    return originalText = bytes.toString(CryptoJS.enc.Utf8);
}

/*redirects to student Page*/
exports.navigate_to_studentProfile = async function (req, res) {
    try {
        var goals = [];
        await Goal.find({studentID: req.params.studentid}, {}, async function(err, goal) {
            goal.name = decryption(goal.name);
            await  goal.forEach(function(s) {
                 goals.push(s);
            });
        });
        await User.findById(req.params.userid,  async function(err, user) {
            await  Student.findById(req.params.studentid,async function(err, student) {
                await     Goal.findById(req.params.goalid,async function(err, goal) {
                    await console.log("\nCurrent student: " + student);
                    await  res.render('pages/studentProfile', {
                        goals: goals,
                        student: student, 
                        user: user
                    });
                });
            });
        });
    } catch(err) {
        await  console.log("exports.navigate_to_studentProfile");
        await  console.log(err);
        await res.render('./error');
    }
}

/*redirects to class page*/
exports.navigate_to_classPage = async function (req, res) {
    try {
        await console.log("student.controller email in body:" + req.body.email);
        var students = [];

        
        await Student.find({}, {}, function(err, student) {
            student.forEach(async function(s) { 
                    await console.log("pushing student", s);
                    await students.push(s);
            });
        });
        await console.log("\n\n\n\n\n\n\n\n\nstudents in students", students);
        await Student.findById(req.params.studentid, async function(err, student) {
            await res.render('pages/classPage', {
                students: students
            });
        });
    } catch(err) {
        await console.log("exports.navigate_to_classPage");
        await console.log(err);
        await res.render('./error');
    }
}

/*redirects to new student page*/
exports.navigate_to_createNewStudent = function (req, res) {
    try {
        User.findById(req.params.userid, function(err, user){ 
            Student.findById(req.params.studentid, function(err, student) {
                res.render('pages/createNewStudent', {
                    user: user
                });
            });
        });
    } catch(err) {
        console.log("exports.navigate_to_createNewStudent");
        console.log(err);
        res.render('./error');
    }
}

exports.student_delete = function (req, res) {
    try {
        Student.findByIdAndRemove(req.params.studentid, function (err) {
            if (err) {
                console.log(err);
            } else {
            res.redirect('/classPage');
            }
        })
    } catch(err) {
        console.log("exports.student_delete");
        console.log(err);
        res.render('./error');
    }        
};

exports.student_redirect_edit = function (req, res) {
    console.log("redirecting to edit page");
    try {
        User.findById(req.params.userid, function(err, user) {
            Student.findById(req.params.studentid, function(err, student) {
                res.render('pages/editStudent', {
                    student: student, 
                    user: user
                });
            });
        });
 
    } catch(err) {
        console.log("exports.student_redirect_edit");
        console.log(err);
        res.render('./error');
    }
};

exports.student_edit = function (req, res) {
    console.log("Student being edited: " + req.params.studentid);
    Student.findByIdAndUpdate(req.params.studentid,
        { $set: { firstname: req.body.firstname,
            lastname: req.body.lastname,
            grade: req.body.grade,
            dob: req.body.dob,
            email: req.body.studentemail
             } }, function (err) {
          if (err) {
            console.log("exports.student_edit");
            console.log(err);
          }
          else {
            res.redirect('/student/' + req.params.studentid);
          }
        });
}

exports.navigate_to_sharedWithMeClassPage = async function (req, res) {
    try {
        var students = [];

        await Student.find({}, {}, async function(err, student) {
            student.forEach(async function(s) { 
                    await students.push(s);
            });
        });
        //console.log("\nParameter student id: " + req.params.studentid);

        await Student.findById(req.params.studentid, async function(err, student) {
            await res.render('pages/sharedWithMeClassPage', {
                students: students
            });
        });
    } catch(err) {
        await console.log("exports.navigate_to_sharedWithMeClassPage");
        await console.log(err);
        await res.render('./error');
    }
}

/*first function used when website starts up*/
exports.run = function(req, res) {
    var logout = false;
    try {
    res.render('pages/index', {
        logout: logout
}); //navigates back to log in menu
    } catch(err) {
        console.log("exports.run");
        console.log(err);
        res.render('./error');
    }
}