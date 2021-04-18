const Student = require('../models/student.model');
const Goal = require('../models/goal.model');
const User = require('../models/user.model');
const Teacher = require('../models/teacher.model');
var CryptoJS = require("crypto-js");
const mongoose = require('mongoose');
var sha256 = require('js-sha256');

async function encryption(string) {
    let ciphertext = await CryptoJS.AES.encrypt(string, 'secret key 123').toString();
    return ciphertext;
}

async function decryption(ciphertext) {
    // await console.log("decryption")
    var bytes = await CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    // await console.log("bytes:", bytes);
    var originalText = await bytes.toString(CryptoJS.enc.Utf8);
    console.log("originalText", originalText)
    // await console.log("originalText", originalText);
    return originalText;
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

/*creates new student profile in database and ensures their is a teacher profile for them*/
exports.student_create = async function (req, res) {
    //Converting date to YYYY-MM-DD
    console.log("encryption", sha256(""))
    if (req.body.dob != NaN) {
        req.body.dob = convertToYYYYMMDD(req.body.dob);
    }
    
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
                userid: sha256(req.body.userID)
            }
        );
        let student = new Student(
            {
                firstname: await encryption(req.body.firstname),
                lastname: await encryption(req.body.lastname),
                grade: req.body.grade,
                dob: req.body.dob,
                email: sha256(req.body.studentemail),
                goals: [],
                userid: sha256(req.body.userID),
                shared: false
            }
        );
        // console.log("post break");
        // console.log("req.body.userID", req.bosy.userID);
        // console.log("Student.exists({userID: req.body.userID})", Teaccher.exists({email: req.body.studentemail}));

        // new
        Teacher.count({ userid: sha256(req.body.userID) }, function (err, count) {

            if (count == 0) {
                // console.log("teacher count", count);
                teacher.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })



        // new
        Student.count({ email: sha256(req.body.studentemail) }, function (err, count) {

            if (count == 0) {
                // this accounts for when a student is created for the first time
                // console.log("student count", count);
                Teacher.findOneAndUpdate({ userid: sha256(req.body.userID) }, { $push: { students: student } }, function (err, teacher) {
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
                Teacher.findOne({ userid: sha256(req.body.userID) }, async function (err, result) {
                    if (err) {
                        console.log("err", err)
                    }
                    else {
                        Student.findOne({ email: sha256(req.body.studentemail) }, async function (err1, result1) {
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
                                    Teacher.updateOne({ userid: sha256(req.body.userID) }, { $push: { students: result1 } }, function (err, docs) {
                                        if (err) {
                                            console.log("err", err)
                                        }
                                        else {
                                            // console.log("docs", docs)
                                        }
                                    })
                                    Student.updateOne({ email: sha256(req.body.studentemail) }, { $push: { userid: sha256(req.body.userID) } }, function (err, docs) {
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

    } catch (err) {
        //console.log(err);
        console.log("exports.student_create");
        res.render('pages/error');
    }
};

function csvToArr(s) {
    var table = []
    console.log("s", s)
    var rows = s.split(',,')
    console.log("rows", rows)
    // console.log("rows", rows)
    for (let i = 1; i < rows.length - 1; i++) {
        var splitRow = rows[i].split(',');
        // console.log("splitRow", splitRow)
        table.push(splitRow)
    }
    // console.log("table", table)
    return table
}


async function create(teacherEmail, studentFirstName, studentLastName, studentEmail) {
    // await console.log("CREATE")
    await console.log("teacherEmail", teacherEmail)
    await console.log("studentEmail", studentEmail)
    await console.log("hashed teacher email", sha256(teacherEmail))
    await console.log("hashed student email", sha256(studentEmail))

    let teacher = new Teacher(
        {
            students: [],
            shared: false,
            sharedwith: false,
            userid: sha256(teacherEmail)
        }
    );

    let student = new Student(
        {
            firstname: await encryption(studentFirstName),
            lastname: await encryption(studentLastName),
            grade: null,
            dob: null,
            email: sha256(studentEmail),
            goals: [],
            userid: sha256(teacherEmail),
            shared: false
        }
    );



    await Student.countDocuments({ email: sha256(studentEmail) }, function (err, count) {
        if (count == 0) {
            // create the student object
            // await console.log("student count == 0, CREATING STUDENT")

            student.save(function (err) {
                if (err) {
                    console.log(err);
                }
                return true
            });
        }
        return true
    })



    if (await updateUserID(studentEmail, teacherEmail) == true) {
        Student.findOneAndUpdate({ email: sha256(studentEmail) }, { $push: { userid: sha256(teacherEmail) } }, function (err, docs) {
            // await console.log("updateUserID == true for ", teacherEmail)
            if (err) {
                console.log("err", err)
            }
            else {
                console.log("docs", docs)
            }
            return true
        })
    }


    await Teacher.countDocuments({ userid: sha256(teacherEmail) }, async function (err, count) {
        if (count == 0) {
            // create the teacher object
            // await console.log("teacher count == 0, CREATING TEACHER")

            await teacher.save(function (err) {
                if (err) {
                    console.log(err);
                }
                return true
            });

        }



        if (await updateStudents(studentEmail, teacherEmail) == true) {

            await Student.findOne({ email: sha256(studentEmail) }, async function (err, result) {
                // await console.log("STUDENT.FINDONE")
                Teacher.findOneAndUpdate({ userid: sha256(teacherEmail) }, { $push: { students: result } }, async function (err, docs) {
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
    await Student.findOne({ email: sha256(studentEmail) }, function (err, result) {
        for (let i = 0; i < result.userid.length; i++) {
            console.log(sha256(teacherEmail), i)
            console.log("result.userid[i]", result.userid[i]);
            if (result.userid[i] == sha256(teacherEmail)) {
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
    await Student.findOne({ email: sha256(studentEmail) }, async function (err, result) {
        await Teacher.findOne({ userid: sha256(teacherEmail) }, async function (err, result1) {
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


exports.bulk_add = async function (req, res) {
    // console.log("BULKADD")
    // await console.log("req.body", req.body)
    var file = req.body.excel
    // await console.log(file)
    var table = await csvToArr(req.body.arr)
    console.log("table", table)
    for (let i = 0; i < table.length; i++) {
        // await console.log("table[i]", table[i])
        await create(table[i][5], table[i][0], table[i][1], table[i][2])
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

        await Goal.find({ studentID: req.params.studentid }, {}, async function (err, goal) {
            // console.log("in Goal.find");
            await goal.forEach(async function (s) {
                // await console.log("pre log statements");
                await console.log("name", s.name);
                await console.log("description", s.description);
                // await console.log("ID", s.studentID);
                // await console.log("post log statements");
                // console.log("goal pre decrypt", s)
                
                s.name = await decryption(s.name);
                s.description = await decryption(s.description);
                s.userid = s.userid
                // console.log("goal pre decrypt", s)



                // await console.log("pre log statements");
                await console.log("name", s.name);
                await console.log("description", s.description);
                // await console.log("ID", s.studentID);
                // await console.log("post log statements");
                // if (s.userid == req.params.studnetid)

                await goals.push(s);
            });

        }).then(() => {
            // console.log("post Goal.find");
            User.findById(req.params.userid, async function (err, user) {
                await Student.findById(req.params.studentid, async function (err, student) {
                    await Goal.findById(req.params.goalid, async function (err, goal) {
                        // await console.log("\nCurrent student: " + student);
                        // console.log("student pre decrypt", student)
                        student.firstname = await decryption(student.firstname);
                        student.lastname = await decryption(student.lastname);
                        student.email = student.email;
                        for (let i = 0; i < student.userid.length; i++) {
                            student.userid[i] = student.userid[i]
                        }
                        // student.userid = await decryption(student.userid);
                        // console.log("student post decrypt", student)
                        await console.log("render from navigate_to_studentProfile");
                        await res.render('pages/studentProfile', {
                            goals: goals,
                            student: student,
                            user: user
                        });
                    });
                });
            });
        });

    } catch (err) {
        // await  console.log("exports.navigate_to_studentProfile");
        console.log(err);
        await res.render('pages/error');
    }
}

/*redirects to class page*/
exports.navigate_to_classPage = async function (req, res) {
    try {
        console.log("navigate_to_class_page")
        console.log("req.params", req.params)

        var students = [];

        // await console.log("decryptStudentList", await decryptStudentList())
        await res.render('pages/classPage', {
            students: await decryptStudentList()
        });



    } catch (err) {
        console.log("Error attempting to navigate_to_classPage");
        console.log(err);
        // console.log("Waiting and then redirecting back to class page");
        // setTimeout(() => { res.render("pages/classPage"); }, 1000);
        await res.render('pages/error');
    }
}

async function decryptStudentList() {

    let students = []
    let promises = await Student.find({}).map(async function (stud) {
        return stud.map(async function (s) {
            console.log(s)
            s.firstname = await decryption(s.firstname);
            s.lastname = await decryption(s.lastname);
            

            return s
        })

    })

    const result = await Promise.all(promises)
    console.log(result)

    return result
}

/*redirects to new student page*/
exports.navigate_to_createNewStudent = function (req, res) {
    try {
        console.log("studentid", req.params.studentid)
        User.findById(req.params.userid, function (err, user) {
            Student.findById(req.params.studentid, function (err, student) {
                res.render('pages/createNewStudent', {
                    user: user
                });
            });
        });
    } catch (err) {
        // console.log("exports.navigate_to_createNewStudent");
        console.log(err);
        res.render('pages/error');
    }
}

// deletes the student from the database
exports.student_delete = function (req, res) {
    try {
        Student.findByIdAndRemove(req.params.studentid, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/classPage');
            }
        })
    } catch (err) {
        console.log("exports.student_delete");
        console.log(err);
        res.render('pages/error');
    }
};

// redirects to the edit student page
exports.student_redirect_edit = async function (req, res) {
    console.log("redirecting to edit page");
    try {
        User.findById(req.params.userid, async function (err, user) {
            Student.findById(req.params.studentid, async function (err, student) {
                console.log("student pre decrypt", student)
                
                student.firstname = await decryption(student.firstname);
                student.lastname = await decryption(student.lastname);
                student.email = student.email;
                for (let i = 0; i < student.userid.length; i++) {
                    student.userid[i] = student.userid[i]
                }
                // student.userid = await decryption(student.userid);
                // console.log("student post decrypt", student)
                await res.render('pages/editStudent', {
                    student: student,
                    user: user
                });
            });
        });

    } catch (err) {
        console.log("exports.student_redirect_edit");
        console.log(err);
        res.render('pages/error');
    }
};

// edits the student's information
exports.student_edit = async function (req, res) {
    //Converting date to YYYY-MM-DD
    if (req.body.dob != NaN) {
        req.body.dob = convertToYYYYMMDD(req.body.dob);
    }

    console.log("student_edit func")
    console.log("body", req.body)
    console.log("params", req.params)
    console.log("Student being edited: " + req.params.studentid);

    Student.findByIdAndUpdate(req.params.studentid,
        {
            $set: {
                firstname: await encryption(req.body.firstname),
                lastname: await encryption(req.body.lastname),
                grade: req.body.grade,
                dob: req.body.dob,
                email: req.body.studentemail
            }
        }, function (err) {
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

        await Student.find({}, {}, async function (err, student) {
            student.forEach(async function (s) {
                // console.log("student pre decrypt", s)
                s.firstname = s.firstname;
                s.lastname = s.lastname;
                s.email = await decryption(s.email);
                for (let i = 0; i < s.userid.length; i++) {
                    s.userid[i] = s.userid[i]
                }
                // s.userid = await decryption(s.userid);
                // console.log("student post decrypt", s)
                await students.push(s);
            });
        });
        //console.log("\nParameter student id: " + req.params.studentid);

        await Student.findById(req.params.studentid, async function (err, student) {
            await res.render('pages/sharedWithMeClassPage', {
                students: students
            });
        });
    } catch (err) {
        // await console.log("exports.navigate_to_sharedWithMeClassPage");
        await console.log(err);
        await res.render('pages/error');
    }
}

/*first function used when website starts up*/
exports.run = function (req, res) {
    var logout = false;
    try {
        res.render('pages/index', {
            logout: logout
        }); //navigates back to log in menu
    } catch (err) {
        console.log("exports.run");
        console.log(err);
        res.render('pages/error');
    }
}