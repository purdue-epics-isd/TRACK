const Student = require('../models/student.model');
const Goal = require('../models/goal.model');
const User = require('../models/user.model');
const Teacher = require('../models/teacher.model');
var CryptoJS = require("crypto-js");
const mongoose = require('mongoose');
/*creates new student profile in database and ensures their is a teacher profile for them*/
exports.student_create = async function (req, res) {
    try {
        await console.log("pre break");
        await console.log(req.body);
        // need to ensure that duplicate teacher and student objects are not created twice, this will be done
        // by ensuring that no two teacher have the same userid and that no two students have the same email
        let teacher = new Teacher(
            {
                students: [],
                shared: false,
                sharedwith: false,
                userid: req.body.userID
            }
        );
        let student = new Student(
            {   firstname: await encryption(req.body.firstname),
                lastname: await encryption(req.body.lastname),
                grade: req.body.grade,
                dob: req.body.dob,
                email: req.body.studentemail,
                goals: [],
                userid: req.body.userID,
                shared: false
            }
        );
        // console.log("post break");
        // console.log("req.body.userID", req.bosy.userID);
        // console.log("Student.exists({userID: req.body.userID})", Teaccher.exists({email: req.body.studentemail}));

        // new
        Teacher.count({userid: req.body.userID}, function(err, count) {
            if (count==0) {
                console.log("teacher count", count);
                teacher.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })
        

        // new
        Student.count({email: req.body.studentemail}, function(err, count) {

            if (count==0) {
                // this accounts for when a student is created for the first time
                console.log("student count", count);
                Teacher.findOneAndUpdate({userid: req.body.userID}, {$push: {students: student}}, function (err, teacher) {
                    student.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.redirect("/classPage");
                        }
                    });
                })   
            }
            else {
                // If count > 0, then there are 2 situations.  Either a teacher is trying to create
                // a student they have already created, or a teacher is trying to create a student that
                // another teacher has created.  If it is the first situation, nothing should happen.
                // however if the second situation happens, a student should not be created, but the student
                // that has already been created should be appended to that teachers list of students.  In 
                // addition to this, the teacher should be appended to the list of teachers on a student
                // object.
                Teacher.findOne({userid: req.body.userID}, async function(err, result) {
                    if (err) {
                        console.log("err", err)
                    }
                    else {
                        Student.findOne({email: req.body.studentemail}, async function(err1, result1) {
                            if (err1) {
                                console.log("err1", err1)
                            }
                            else {
                                console.log("result1", result1)
                                console.log("result", result)
                                console.log(result1._id)
                                let studentid = result1._id
                                console.log("no errors")
                                let studentArr = result.students
                                console.log("looking for id #", studentid);
                                console.log("studentArr", studentArr)
                                let inTeachersStudArr = false
                                for (let i = 0; i < studentArr.length; i++) {
                                    console.log(studentArr[i])
                                    if (studentArr[i].toString() == studentid) {
                                        inTeachersStudArr = true
                                    }
                                }
                                console.log("result", result)
                                console.log("inTeachersStudArr", inTeachersStudArr)
                                if (!inTeachersStudArr) {
                                    // if the id is not in the list of students append the id to the user
                                    Teacher.updateOne({userid: req.body.userID}, {$push: {students: student}}, function(err, docs) {
                                        if (err) {
                                            console.log("err", err)
                                        }
                                        else {
                                            console.log("docs", docs)
                                        }
                                    })
                                    Student.updateOne({email: req.body.studentemail}, {$push: {userid: req.body.userID}}, function(err, docs) {
                                        if (err) {
                                            console.log("err", err)
                                        }
                                        else {
                                            console.log("docs", docs)
                                        }
                                    })
                                }
                                // else do nothing
                            }
                        })
                         
                    }        
                })
                    
            
                res.redirect("/classPage");
            }
            
        });
        
    } catch(err) {
        //console.log(err);
        console.log("exports.student_create");
        res.render('./error');
    }
};

async function encryption(string) {
    let ciphertext = await CryptoJS.AES.encrypt(string, 'secret key 123').toString();
    return ciphertext;
}

async function decryption(ciphertext) {
    // await console.log("decryption")
    var bytes  = await CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    // await console.log("bytes:", bytes);
    var originalText = await bytes.toString(CryptoJS.enc.Utf8);
    // await console.log("originalText", originalText);
    return originalText;
}

/*redirects to student Page*/
exports.navigate_to_studentProfile = async function (req, res) {
    try {
        console.log("navigate_to_studentProfile");
        var goals = [];
        // console.log("pre Goal.find");
        await Goal.find({studentID: req.params.studentid}, {}, async function(err, goal) {
            // console.log("in Goal.find");
            await goal.forEach(async function(s) {
                // await console.log("pre log statements");
                // await console.log("name", s.name);
                // await console.log("description", s.description);
                // await console.log("ID", s.studentID);
                // await console.log("post log statements");

                s.name =  await decryption(s.name);
                s.description = await decryption(s.description);//error happens here.
                

                // await console.log("pre log statements");
                // await console.log("name", s.name);
                // await console.log("description", s.description);
                // await console.log("ID", s.studentID);
                // await console.log("post log statements");

                await goals.push(s);
            });

        });
        console.log("post Goal.find");
        await User.findById(req.params.userid,  async function(err, user) {
            await  Student.findById(req.params.studentid,async function(err, student) {
                await  Goal.findById(req.params.goalid,async function(err, goal) {
                    // await console.log("\nCurrent student: " + student);
                    student.firstname = await decryption(student.firstname);
                    student.lastname = await decryption(student.lastname);
                    await  res.render('pages/studentProfile', {
                        goals: goals,
                        student: student, 
                        user: user
                    });
                });
            });
        });
    } catch(err) {
        // await  console.log("exports.navigate_to_studentProfile");
        // await  console.log(err);
        await res.render('./error');
    }
}

/*redirects to class page*/
exports.navigate_to_classPage = async function (req, res) {
    try {
        await console.log("student.controller email in body:" + req.body.email);
        var students = [];
        // var classes = [];
        // var teachers = [];

        // await console.log("localStorage", localStorage)


        
        await Student.find({}, {}, async function(err, student) {
            await student.forEach(async function(s) { 
                
                    // s.firstname =  await decryption(s.name);

                    // s.lastname = await decryption(s.description);
                    // await console.log("pushing student", s);
                    // await console.log("s.name", await decryption(s.firstname));
                    s.firstname = await decryption(s.firstname);
                    s.lastname = await decryption(s.lastname);
                    
                    await students.push(s);
            });
        });

        // await Teacher.find({}, {}, async function(err, teacher) {

        //     await teacher.forEach(async function(t) {
        //         await teachers.push(t)
        //         let students = t.students;
        //         await console.log(students)
        //         let studentArr = []
        //         await students.forEach(async function(s) {
        //             await console.log("s", s);
        //             await Student.find({_id: s}, async function(err, student) {
        //                 // await console.log("student", student)
        //                 await studentArr.push(student);
        //                 // await console.log("studentArr", studentArr);
        //             })
        //             await console.log("adding this to classes", studentArr)
        //             await classes.push(studentArr)
        //             await console.log("classes", classes[0])
        //         })
        //         // await console.log("studentArr now!?", studentArr)
        //         // await classes.push(studentArr);
        //         // await console.log("classes", classes);
        //     })

        // })

        // await console.log("req.params", req.params)
        // await console.log("req.body.userID", req.body.userID)
        // await console.log("req.body.studentemail", req.body.studentemail)

        // await console.log("classes now", classes)

        // await console.log("\n\n\n\n\n\n\n\n\nstudents in students", students);
        await Student.findById(req.params.studentid, async function(err, student) {
            await console.log("req.params.studentid", req.params.studentid)
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

exports.student_redirect_edit = async function (req, res) {
    console.log("redirecting to edit page");
    try {
        User.findById(req.params.userid, async function(err, user) {
            Student.findById(req.params.studentid, async function(err, student) {
                student.firstname = await decryption(student.firstname);
                student.lastname = await decryption(student.lastname);
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
                    s.firstname = await decryption(s.firstname);
                    s.lastname = await decryption(s.lastname);
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