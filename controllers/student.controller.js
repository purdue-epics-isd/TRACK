const Student = require('../models/student.model');
const Goal = require('../models/goal.model');
const User = require('../models/user.model');


/*creates new student profile in database*/
exports.student_create = function (req, res) {
    try {
        console.log("creating new student...");
        //console.log(localStorage.getItem("userID"));
        let student = new Student(
            {   firstname: req.body.firstname,
                lastname: req.body.lastname,
                period: "period" + req.body.period,
                grade: req.body.grade,
                age: req.body.age,
                goals: [],
                userid: req.body.userID
            }
        );
        //console.log("userid upon student creation: " + localStorage.getItem("userID"));


        console.log(student);
        student.save(function (err) {
            if (err) {
                res.send(err);
            } /*else {
                var goals = [];

                Student.findById(student.id, function(err, student) {
                    res.render('pages/studentProfile', {
                        student: student,
                        goals: goals
                    });
               });
            }*/
        })
        res.redirect("/classPage");
    } catch(err) {
        console.log(err);
        res.render('/error');
    }
};

/*redirects to student Page*/
exports.navigate_to_studentProfile = function (req, res) {
    try {
        var goals = [];

        Goal.find({studentID: req.params.studentid}, {}, function(err, goal) {
            goal.forEach(function(s) { 
                //console.log("s.studentID: " + s.studentID);
                //console.log("req.params.studentid: " + req.params.studentid);
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
        //
        //var id = User.Identity.GetUserId();
        var userId= Session["userId"] ;
        //console.log(user);

        Student.find({}, {}, function(err, student) {
            student.forEach(function(s) { 
                
        //        if(s.userid==req.params.userid) {
                    console.log(s); console.log(s.name); 
                    students.push(s);
       //         };
            });
        });

        //User.findById(req.params.userid, function(err, user) {
            Student.findById(req.params.studentid, function(err, student) {
                res.render('pages/classPage', {
                    students: students, 
        //            user: user
                });
            });
        //});
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

/*first function used when website starts up*/
exports.run = function(req, res) {
    try {
        res.render('pages/index');
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
}
