const Student = require('../models/student.model');

/* TODO: authenticate login and change URL name when it redirects to the classpage*/
exports.login = async function (req, res) {
    try {
        var students = [];
        // searches through the User collection in mongodb and will find all of the users who's _id attribute matches req.params.userid
        await User.findById(req.params.userid, async function(err, user) {
            // runs an asyc function on every user in the db
            await Student.find({}, 'name', async function(err, student) {
                await student.forEach(async function(s) { 
                    if(student.userid==req.params.userid) {
                        await console.log(s);
                        await console.log(s.name); 
                        await students.push(s);
                    }
                });
            });
        });
        await User.findById(req.params.userid, async function(err, user) {
            await Student.findById(req.params.studentid, async function(err, student) {
                // res.render will display the webpage as the classpage, also saving students and user in req.body
                await res.render('pages/classPage', {
                    students: students,
                    user: user
                });
            });
        });
    } catch(err) {
        console.log("exports.login");
        console.log(err);
        res.render('./error');
    }
}

/* TODO: actually log out */
exports.logout = function (req, res) {
    var logout = true;
    try {
	   res.render('pages/index', {
        logout: logout
    });
    } catch(err) {
        console.log("exports.logout");
        console.log(err);
        res.render('./error');
    }
};

