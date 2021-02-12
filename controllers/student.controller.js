const Student = require('../models/student.model');
const Goal = require('../models/goal.model');
const User = require('../models/user.model');
const Teacher = require('../models/teacher.model');
var CryptoJS = require("crypto-js");
const mongoose = require('mongoose');

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
/*creates new student profile in database and ensures their is a teacher profile for them*/
exports.student_create = async function (req, res) {
    try {
        // await console.log("pre break");
        // await console.log(req.body);
        // need to ensure that duplicate teacher and student objects are not created twice, this will be done
        // by ensuring that no two teacher have the same userid and that no two students have the same email
        let teacher = new Teacher(
            {
                students: [],
                shared: false,
                sharedwith: false,
                userid: await encryption(req.body.userID)
            }
        );
        let student = new Student(
            {   firstname: await encryption(req.body.firstname),
                lastname: await encryption(req.body.lastname),
                grade: req.body.grade,
                dob: req.body.dob,
                email: await encryption(req.body.studentemail),
                goals: [],
                userid: await encryption(req.body.userID),
                shared: false
            }
        );
        // console.log("post break");
        // console.log("req.body.userID", req.bosy.userID);
        // console.log("Student.exists({userID: req.body.userID})", Teaccher.exists({email: req.body.studentemail}));

        // new
        Teacher.count({userid: await encryption(req.body.userID)}, function(err, count) {
            if (count == 0) {
                // console.log("teacher count", count);
                teacher.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })
        

        // new
        Student.count({email: await encryption(req.body.studentemail)}, function(err, count) {

            if (count == 0) {
                // this accounts for when a student is created for the first time
                // console.log("student count", count);
                Teacher.findOneAndUpdate({userid: encryption(req.body.userID)}, {$push: {students: student}}, function (err, teacher) {
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
                Teacher.findOne({userid: encryption(req.body.userID)}, async function(err, result) {
                    if (err) {
                        console.log("err", err)
                    }
                    else {
                        Student.findOne({email: await encryption(req.body.studentemail)}, async function(err1, result1) {
                            if (err1) {
                                console.log("err1", err1)
                            }
                            else {
                                // console.log("result1", result1)
                                // console.log("result", result)
                                // console.log(result1._id)
                                let studentid = result1._id
                                // console.log("no errors")
                                let studentArr = result.students
                                // console.log("looking for id #", studentid);
                                // console.log("studentArr", studentArr)
                                let inTeachersStudArr = false
                                for (let i = 0; i < studentArr.length; i++) {
                                    // console.log(studentArr[i])
                                    if (studentArr[i].toString() == studentid) {
                                        inTeachersStudArr = true
                                    }
                                }
                                // console.log("result", result)
                                // console.log("inTeachersStudArr", inTeachersStudArr)
                                if (!inTeachersStudArr) {
                                    // if the id is not in the list of students append the id to the user
                                    Teacher.updateOne({userid: await encryption(req.body.userID)}, {$push: {students: result1}}, function(err, docs) {
                                        if (err) {
                                            console.log("err", err)
                                        }
                                        else {
                                            // console.log("docs", docs)
                                        }
                                    })
                                    Student.updateOne({email: await encryption(req.body.studentemail)}, {$push: {userid: await encryption(req.body.userID)}}, function(err, docs) {
                                        if (err) {
                                            console.log("err", err)
                                        }
                                        else {
                                            // console.log("docs", docs)
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

function csvToArr(s) {
    var table = []
    // console.log(s)
    var rows = s.split(',,')
    // console.log("rows", rows)
    for (let i = 0; i < rows.length - 1; i++) {
        var splitRow = rows[i].split(',');
        // console.log("splitRow", splitRow)
        table.push(splitRow)
    }
    // console.log("table", table)
    return table
}


async function create(teacherEmail, studentFirstName, studentLastName, studentEmail) {
    // await console.log("CREATE")
    // await console.log("teacherEmail", teacherEmail)
    // await console.log("studentEmail", studentEmail)
    

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
            // await console.log("student count == 0, CREATING STUDENT")
            
            await student.save(function(err) {
                if (err) {
                    console.log(err);
                }
                return true
            });
        }   
        return true
    })
    

    
    if (await updateUserID(studentEmail, teacherEmail) == true) {
        Student.findOneAndUpdate({email: studentEmail}, {$push: {userid: teacherEmail}}, async function(err, docs) {
            // await console.log("updateUserID == true for ", teacherEmail)
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
            // await console.log("teacher count == 0, CREATING TEACHER")
            
            await teacher.save(function(err) {
                if (err) {
                    console.log(err);
                }
                return true
            });
            
        }



        if (await updateStudents(studentEmail, teacherEmail) == true) {
            
            await Student.findOne({email: studentEmail}, async function(err, result) {
                // await console.log("STUDENT.FINDONE")
                Teacher.findOneAndUpdate({userid: teacherEmail}, {$push: {students: result}}, async function(err, docs) {
                    // await console.log("updateStudents == true for ", teacherEmail)
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

async function updateUserID(studentEmail, teacherEmail) {
    let updateUserID = true
    await Student.findOne({email: studentEmail}, async function(err, result) {
        for (let i = 0; i < await getIDLength(result); i++) {
            // await console.log(teacherEmail, i)
            // await console.log("result.userid[i]", result.userid[i]);
            if (result.userid[i] == teacherEmail) {
                // await console.log("setting updateUserID to false for ", teacherEmail, studentEmail)
                updateUserID = false
            }
        }
        return true
    })
    // await console.log(teacherEmail, studentEmail, "returning from updateUserID with val ", updateUserID)
    return updateUserID

}

async function getIDLength(result) {
    return result.userid.length
}

async function getStudentsLength(result1) {
    return result1.students.length
}

async function updateStudents(studentEmail, teacherEmail) {
    let updateStudents = true
    await Student.findOne({email: studentEmail}, async function(err, result) {
        await Teacher.findOne({userid: teacherEmail}, async function(err, result1) {
            for (let i = 0; i < await getStudentsLength(result1); i++) {
                // await console.log(teacherEmail, i)
                if (result._id == result1.students[i]) {
                    // await console.log("setting updateStudents false for ", teacherEmail, studentEmail)
                    updateStudents = false
                }
            }
            return true
        })
        return true
    })
    // await console.log(teacherEmail, studentEmail, "returning from updateStudents with val ", updateStudents)
    return updateStudents
}


exports.bulk_add = async function(req, res) {
    // console.log("BULKADD")
    // await console.log("req.body", req.body)
    var file = req.body.excel
    // await console.log(file)
    var table = await csvToArr(req.body.arr)
    // console.log("table", table)
    for (let i = 1; i < table.length; i++) {
        // await console.log("table[i]", table[i])
        await create(await encryption(table[i][5]), await encryption(table[i][0]), await encryption(table[i][1]), await encryption(table[i][2]))
        // await setTimeout(() => {  console.log("resting"); }, 1000);
    }

    await res.redirect("/classPage");

}


/*redirects to student Page*/
exports.navigate_to_studentProfile = async function (req, res) {
    try {
        // console.log("navigate_to_studentProfile");

        var goals = [];
        // console.log("pre Goal.find");
        // console.log(req.params)
        await Goal.find({studentID: req.params.studentid}, {}, async function(err, goal) {
            // console.log("in Goal.find");
            await goal.forEach(async function(s) {
                // await console.log("pre log statements");
                // await console.log("name", s.name);
                // await console.log("description", s.description);
                // await console.log("ID", s.studentID);
                // await console.log("post log statements");
                // console.log("goal pre decrypt", s)
                s.name =  await decryption(s.name);
                s.description = await decryption(s.description);
                s.userid = await decryption(s.userid)
                // console.log("goal pre decrypt", s)

                

                // await console.log("pre log statements");
                // await console.log("name", s.name);
                // await console.log("description", s.description);
                // await console.log("ID", s.studentID);
                // await console.log("post log statements");
                // if (s.userid == req.params.studnetid)
                await goals.push(s);
            });

        });
        // console.log("post Goal.find");
        await User.findById(req.params.userid,  async function(err, user) {
            await  Student.findById(req.params.studentid,async function(err, student) {
                await  Goal.findById(req.params.goalid,async function(err, goal) {
                    // await console.log("\nCurrent student: " + student);
                    // console.log("student pre decrypt", student)
                    student.firstname = await decryption(student.firstname);
                    student.lastname = await decryption(student.lastname);
                    student.email = await decryption(student.email);
                    for (let i = 0; i < student.userid.length; i++) {
                        student.userid[i] = await decryption(student.userid[i])
                    }
                    // student.userid = await decryption(student.userid);
                    // console.log("student post decrypt", student)
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
        // await console.log("student.controller email in body:" + req.body.email);
        var students = [];
        // var classes = [];
        // var teachers = [];

        // await console.log("localStorage", localStorage)


        
        await Student.find({}, {}, async function(err, student) {
            await student.forEach(async function(s) { 
                    // console.log("student pre decrypt", s)
                
                    // s.firstname =  await decryption(s.name);

                    // s.lastname = await decryption(s.description);
                    // await console.log("pushing student", s);
                    // await console.log("s.name", await decryption(s.firstname));
                    s.firstname = await decryption(s.firstname);
                    s.lastname = await decryption(s.lastname);
                    s.email = await decryption(s.email);
                    for (let i = 0; i < s.userid.length; i++) {
                        s.userid[i] = await decryption(s.userid[i])
                    }
                    // s.userid = await decryption(s.userid);
                    // console.log("student post decrypt", s)
                    
                    await students.push(s);
            });
        });

        
        // await console.log(students)
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
        // console.log("exports.navigate_to_createNewStudent");
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
                // console.log("student pre decrypt", student)
                student.firstname = await decryption(student.firstname);
                student.lastname = await decryption(student.lastname);
                student.email = await decryption(student.email);
                for (let i = 0; i < student.userid.length; i++) {
                    student.userid[i] = await decryption(student.userid[i])
                }
                // student.userid = await decryption(student.userid);
                // console.log("student post decrypt", student)
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
        { $set: { firstname: encryption(req.body.firstname),
            lastname: encryption(req.body.lastname),
            grade: req.body.grade,
            dob: req.body.dob,
            email: encryption(req.body.studentemail)
             } }, function (err) {
          if (err) {
            // console.log("exports.student_edit");
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
                    // console.log("student pre decrypt", s)
                    s.firstname = await decryption(s.firstname);
                    s.lastname = await decryption(s.lastname);
                    s.email = await decryption(s.email);
                    for (let i = 0; i < s.userid.length; i++) {
                        s.userid[i] = await decryption(s.userid[i])
                    }
                    // s.userid = await decryption(s.userid);
                    // console.log("student post decrypt", s)
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
        // await console.log("exports.navigate_to_sharedWithMeClassPage");
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