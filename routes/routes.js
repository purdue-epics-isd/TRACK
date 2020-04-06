const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy   = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");
// Require packages
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
// Require the controllers
const goal_controller = require('../controllers/goal.controller');
const student_controller = require('../controllers/student.controller');
const goaldata_controller = require('../controllers/goaldata.controller');
const misc_controller = require('../controllers/misc.controller');
const user_controller = require('../controllers/user.controller');

const Student = require('../models/student.model');
const User = require('../models/user.model');
//var userID = sessionStorage.getItem("userID");

const storage = new GridFsStorage({
	url: 'mongodb://TRACK:woofwoofTRACKER7@ds255403.mlab.com:55403/track',
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) return reject(err);
				const filename = file.originalname;
			const fileInfo = {
				filename: filename,
				metadata: req.params.goalid,
				bucketName: 'uploads'
			};
			resolve(fileInfo);
		});
	});
	}

});

const upload = multer({ storage });

let gfs;
let db = mongoose.connection;
db.once('open', () => {
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
});

//TODO: figure out the real difference between router.post and router.get
router.post('/student/create', student_controller.student_create); //adds new student to database
router.post('/student/:studentid/goal/create', goal_controller.goal_create); //adds new goal to database
router.post('/student/:studentid/goal/:goalid/goaldata/create', goaldata_controller.goaldata_create); //adds new goal datapoint to database
router.post('/signUp/createUser', user_controller.createUser);
router.post('/student/:studentid/goal/edit/:goalid', goal_controller.goal_edit);
router.get('/student/:studentid/student_edit', student_controller.student_redirect_edit); //edit student information
router.post('/student/:studentid/student_edit/submit', student_controller.student_edit); //submit final student edits


router.get('/student/:studentid/goal/:goalid/goal_delete', goal_controller.goal_delete);//WHY CAN'T I USE ROUTER.DELETE
router.get('/student/:studentid/goal/:goalid/goal_edit', goal_controller.goal_redirect_edit); //redirect to goal editing page
router.post('/student/:studentid/goal/:goalid/goal_edit/submit', goal_controller.goal_edit); //submit final goal edits
//router.delete('/goal/delete',goal_controller.goal_delete);
router.get('/student/:studentid/goal/:goalid/goal_edit', goal_controller.goal_redirect_edit);
//router.delete('/goal/delete',goal_controller.goal_delete);
router.get('/student/:studentid/goal/:goalid/goaldata_delete/:goaldataid', goaldata_controller.goaldata_delete); //TODO: deletes goal from datapoint
router.get('/student/:studentid/delete', student_controller.student_delete); //TODO: deletes goal from datapoint
router.post('/student/:studentid/goal/:goalid/goaldata/upload',upload.single('file'),(req, res) => res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid));
router.post('/student/:studentid/goal/:goalid/goaldata/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) res.status(404).json({ err: err });
    res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid);
  });
});
router.post('/student/:studentid/goal/:goalid/goaldata/files/:id/download', (req, res) => {

    var filename = req.params.id;

        gfs.exist({ _id: req.params.id, root: 'uploads'}, (err, file) => {
            if (err || !file) {
                res.status(404).send('File Not Found');
        return
            }

      var readstream = gfs.createReadStream({ _id: req.params.id });
      readstream.pipe(res);
        });
    });


router.get('/login_confirm', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
	  if (err) { return next(err); }
	  if (!user) { return res.redirect('/login'); }
	  req.logIn(user, function(err) {
	    if (err) { return next (err); }
    	return res.redirect(req.user.id + '/classPage');
  	});
	}) (req, res, next);
});
//router.get('/profile',user_controller.get_profile)
//router.get('/logout',user_controller.logout)
//GET request can be cached and remains in browser history. This is why GET is not suppose to use for sensitive data (passwords, ATM pins etc). GET are suppose to use to retrieve data only.
//router.get('/test', student_controller.student_details); // a simple test url to check that all of our files are communicating correctly.

router.get('/classPage', student_controller.navigate_to_classPage);

//router.get('/classPage', student_controller.navigate_to_classPage);
//router.get('/classPage1', student_controller.navigate_to_classPage1); // navigates to the class page
router.get('/student/:studentid', student_controller.navigate_to_studentProfile); //navigates to a student profile
router.get('/student/:studentid/goal/:goalid', goal_controller.navigate_to_goalProfile); // navigates to a goal within a student profile
router.get('/student/:studentid/createNewGoal', goal_controller.navigate_to_createNewGoal); //navigates to the "create new goal" page
router.get('/createNewStudent',student_controller.navigate_to_createNewStudent); //navigates to new student page
router.get('/aboutUs', (req, res) => {
	User.findById(req.params.userid, function(err, user) {
		res.render('./pages/aboutUs.ejs', {
			user: user
		})
	});
});
router.get('/feedback', (req, res) => {
	User.findById(req.params.userid, function(err, user) {
		res.render('./pages/feedback.ejs', {
			user: user
		})
	});
});
router.get('/settings', (req, res) => {
	User.findById(req.params.userid, function(err, user) {
		res.render('./pages/settings.ejs', {
			user: user
		})
	});
});
router.get('/signup', (req, res) => {
	res.render('./pages/signup.ejs')
});




router.get('/testing', (req, res) => {
	/*
	async function getFirstUser() {
	    try {
	        let users = await getUsers();
	        return users[0].name;
	    } catch (err) {
	        return {
	            name: 'default user'
	        };
	    }
	}

	function getUsers() {
		res.render('./pages/testing.ejs', {
			users: ["user1", "user2"]
		});
	}

	getFirstUser();*/
	var students = [];
	Student.find({}, {}, function(err, student) {
            student.forEach(function(s) {
                students.push(s);
            });
        });

	res.render('./pages/testing.ejs', {
		students: students,
		test: ["test1", "test2"]
	})
});

router.get('/userfile', (req, res) => {
	res.render('./pages/userfile.ejs')
});

router.get('/signupSuccess', (req, res) => {
	res.render('./pages/signupSuccess.ejs')
});

router.get('/login', misc_controller.login); //navigates to login page
router.get('/logout', (req, res) => {
	var logout = true;
	res.render('pages/index', {
        logout: logout
    });
}); //navigates back to log in menu





module.exports = router;
