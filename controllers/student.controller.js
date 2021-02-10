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
        
        // if there is no teacher in the Teacher collection with userid == req.body.userID, we will create one
        Teacher.count({userid: req.body.userID}, function(err, count) {
            if (count == 0) {
                console.log("teacher count", count);
                teacher.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })
        

        // if there is no student in the teacher collection with email  req.body.studentemail, we will create one
        Student.count({email: req.body.studentemail}, function(err, count) {

            if (count == 0) {
                // this accounts for when a student is created for the first time
                console.log("student count", count);
                // after creating the student we will add it to it's teacher's students array
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
                                    Teacher.updateOne({userid: req.body.userID}, {$push: {students: result1}}, function(err, docs) {
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

// function that will convert a csv file into an array of strings
function csvToArr(s) {
    var table = []
    console.log(s)
    var rows = s.split(',,')
    console.log("rows", rows)
    for (let i = 0; i < rows.length - 1; i++) {
        var splitRow = rows[i].split(',');
        console.log("splitRow", splitRow)
        table.push(splitRow)
    }
    console.log("table", table)
    return table
}

// This function takes in a teacher's email, and a student's first name, last name, and email and creates it in the database.
// Works really similairly to student_create, but with a lot more async quirks
async function create(teacherEmail, studentFirstName, studentLastName, studentEmail) {
    let teacher = new Teacher(
        {
            students: [],
            shared: false,
            sharedwith: false,
            userid: teacherEmail
        }
    );

    let student = new Student(
        {   firstname: await encryption(studentFirstName),
            lastname: await encryption(studentLastName),
            grade: null,
            dob: null,
            email: studentEmail,
            goals: [],
            userid: teacherEmail,
            shared: false
        }
    );

    await Student.countDocuments({email: studentEmail}, async function(err, count) {
        if (count == 0) {
            // create the student object
            await console.log("student count == 0, CREATING STUDENT")
            
            await student.save(function(err) {
                if (err) {
                    console.log(err);
                }
                return true
            });
        }   
        return true
    })

    // Deals with dups in .csv files.  If a teachers email already exists in the students userid array it will not be added
    if (await updateUserID(studentEmail, teacherEmail) == true) {
        Student.findOneAndUpdate({email: studentEmail}, {$push: {userid: teacherEmail}}, async function(err, docs) {
            await console.log("updateUserID == true for ", teacherEmail)
            if (err) {
                await console.log("err", err)
            }
            else {
                // console.log("docs", docs)
            }
            return true
        })
    }
    
    await Teacher.countDocuments({userid: teacherEmail}, async function(err, count) {
        if (count == 0) {
            // create the teacher object
            await console.log("teacher count == 0, CREATING TEACHER")
            
            await teacher.save(function(err) {
                if (err) {
                    console.log(err);
                }
                return true
            });
        }
        // Also deals with dups of a student already existing in a teachers students array
        if (await updateStudents(studentEmail, teacherEmail) == true) {
            await Student.findOne({email: studentEmail}, async function(err, result) {
                Teacher.findOneAndUpdate({userid: teacherEmail}, {$push: {students: result}}, async function(err, docs) {
                    await console.log("updateStudents == true for ", teacherEmail)
                    if (err) {
                        await console.log("err", err)
                    }
                    else {
                        // console.log("docs", docs)
                    }
                    return true
                })
            })
        }
        return true  
    })
    return true
}

// this function is to retain the asynchronous nature of an if statement in create.  
async function updateUserID(studentEmail, teacherEmail) {
    let updateUserID = true
    await Student.findOne({email: studentEmail}, async function(err, result) {
        for (let i = 0; i < await getIDLength(result); i++) {
            await console.log(teacherEmail, i)
            if (result.userid[i] == teacherEmail) {
                updateUserID = false
            }
        }
        return true
    })
    return updateUserID

}

// this function is to retain the asynchronous nature of an if statement in create.  
async function getIDLength(result) {
    return result.userid.length
}

// this function is to retain the asynchronous nature of an if statement in create.  
async function getStudentsLength(result1) {
    return result1.students.length
}

// this function is to retain the asynchronous nature of an if statement in create.  
async function updateStudents(studentEmail, teacherEmail) {
    let updateStudents = true
    await Student.findOne({email: studentEmail}, async function(err, result) {
        await Teacher.findOne({userid: teacherEmail}, async function(err, result1) {
            for (let i = 0; i < await getStudentsLength(result1); i++) {
                if (result._id == result1.students[i]) {
                    updateStudents = false
                }
            }
            return true
        })
        return true
    })
    return updateStudents
}

// this function is ran when the form on bulkadd is submitted.  will call create and csvToArr when called
exports.bulk_add = async function(req, res) {
    var file = req.body.excel
    var table = await csvToArr(req.body.arr)
    console.log("table", table)
    for (let i = 1; i < table.length; i++) {
        await create(table[i][5], table[i][0], table[i][1], table[i][2])
    }
    await res.redirect("/classPage");

}

// helper function to encrypt data in the database
async function encryption(string) {
    let ciphertext = await CryptoJS.AES.encrypt(string, 'secret key 123').toString();
    return ciphertext;
}

// helper function to decrypt data in the database
async function decryption(ciphertext) {
    var bytes  = await CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    var originalText = await bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

/*redirects to student Page*/
exports.navigate_to_studentProfile = async function (req, res) {
    try {
        

        var goals = [];
        console.log(req.params)
        await Goal.find({studentID: req.params.studentid}, {}, async function(err, goal) {
            await goal.forEach(async function(s) {
                // decrypts the name and description of a goal
                s.name =  await decryption(s.name);
                s.description = await decryption(s.description);//error happens here.
                await goals.push(s);
            });

        });
        await User.findById(req.params.userid,  async function(err, user) {
            await  Student.findById(req.params.studentid,async function(err, student) {
                await  Goal.findById(req.params.goalid,async function(err, goal) {
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
        await res.render('./error');
    }
}

/*redirects to class page*/
exports.navigate_to_classPage = async function (req, res) {
    try {
        await console.log("student.controller email in body:" + req.body.email);
        var students = [];


        
        await Student.find({}, {}, async function(err, student) {
            await student.forEach(async function(s) { 
                
                    // decrypts student name and last name for display purposes
                    s.firstname = await decryption(s.firstname);
                    s.lastname = await decryption(s.lastname);
                    
                    await students.push(s);
            });
        });
        
        await res.render('pages/classPage', {
            students: students
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

// deletes a student in the db
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

// sends user to the edit student page
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

// changes the student specified in studetn_redirect_edit to have the specified attributes
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

// isnt used anymore
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