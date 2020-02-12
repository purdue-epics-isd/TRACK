const Student = require('../models/student.model');
const Goal = require('../models/goal.model');
const User = require('../models/user.model');

/*creates new student profile in database*/
exports.student_create = function (req, res) {
    try {
        let student = new Student(
            {   firstname: req.body.firstname,
                lastname: req.body.lastname,
                period: req.body.period,
                grade: req.body.grade,
                dob: req.body.dob,
                email: req.body.studentemail,
                goals: [],
                userid: req.body.userID,
                documentation: []
            }
        );
        student.save(function (err) {
            if (err) {
                console.log(err);
            }
        })
        res.redirect("/classPage");
    } catch(err) {
        res.render('./error');
    }
};

/*redirects to student Page*/
exports.navigate_to_studentProfile = function (req, res) {
    try {
        var goals = [];

        Goal.find({studentID: req.params.studentid}, {}, function(err, goal) {
            goal.forEach(function(s) {
                goals.push(s);
            });
        });
        User.findById(req.params.userid, function(err, user) {
            Student.findById(req.params.studentid, function(err, student) {
                Goal.findById(req.params.goalid, function(err, goal) {
                    res.render('pages/studentProfile', {
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

/*redirects to class page*/
exports.navigate_to_classPage = function (req, res) {
    try {
        var students = [];

        Student.find({}, {}, function(err, student) {
            student.forEach(function(s) { 
                //if(s.userid==req.params.userid) {
                    //console.log(s); console.log(s.name); 
                    students.push(s);
                //};
            });
        });

        User.findById(req.params.userid, function(err, user) {
            Student.findById(req.params.studentid, function(err, student) {
                res.render('pages/classPage', {
                    students: students, 
                    user: user
                });
            });
        });
    } catch(err) {
        console.log(err);
        res.render('./error');
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
        console.log(err);
        res.render('./error');
    }
};

exports.student_edit = function (req, res) {
    console.log("Student being edited: " + req.params.studentid);
    Student.findByIdAndUpdate(req.params.studentid,
            { $set: { firstname: req.body.firstname,
                lastname: req.body.lastname,
                period: req.body.period,
                grade: req.body.grade,
                dob: req.body.dob,
                email: req.body.studentemail
                 } }, function (err) {
              if (err) {
                console.log(err);
              }
              else {
                res.redirect('/student/' + req.params.studentid);
              }
            });
}

exports.student_add_documentation = function (req, res) {
    var Binary = require('mongodb').Binary;
    var data = fs.readFileSync(file_path);
    var insert_data = {};
    insert_data.file_data= Binary(data);
    var collection = db.collection('files');
    collection.insert(insert_data, function(err, result){
    });
    collection.findOne({}).toArray(function (err, documents) {
      console.log(documents);
    });
    collection.findOne({}).toArray(function (err, documents) {
      console.log(documents);
    });
    /*var fs = require('fs');
    let document = req.body.myFile; //TODO: add document parsing
    Student.findOneAndUpdate({_id: req.params.studentid}, {$push: {documentation: document}}, function (err, student) {
        student.save(function (err) { 
            if (err) {
                res.send(err);
            } else {
                res.redirect('/student/' + req.params.studentid);
            }
        });
    });*/
}

// Get pictures
exports.student_get_documentation = function (req, res) {
    var fs = require('fs');
    Student.findById(req.params.studentid, function(err, student) {
      if (err) return next(err);
      //res.contentType(student.documentation.contentType);
      //res.send(student.documentation.data);
  });
}

/*first function used when website starts up*/
exports.run = function(req, res) {
    var logout = false;
    try {
        res.render('pages/index', {
            logout: logout
        }); //navigates back to log in menu
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
}