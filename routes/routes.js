const express = require('express');
const app = express()
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
const Goal = require('../models/goal.model');
const User = require('../models/user.model');



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
router.post('/bulkadd', student_controller.bulk_add); // runs the bulkadd function
router.post('/student/:studentid/goal/create', goal_controller.goal_create); //adds new goal to database
router.post('/student/:studentid/goal/:goalid/goaldata/create/:shared', goaldata_controller.goaldata_create); //adds new goal datapoint to database
router.post('/student/:studentid/goal/:goalid/share', goal_controller.goal_share); //shares goal with another teacher

router.get('/student/:studentid/student_edit', student_controller.student_redirect_edit); //edit student information
router.post('/student/:studentid/student_edit/submit', student_controller.student_edit); //submit final student edits

router.get('/student/:studentid/goal/:goalid/goal_delete', goal_controller.goal_delete);// deletes goal. Also, WHY CAN'T I USE ROUTER.DELETE
router.get('/student/:studentid/goal/:goalid/goal_edit', goal_controller.goal_redirect_edit); //redirect to goal editing page
router.post('/student/:studentid/goal/edit/:goalid', goal_controller.goal_edit); //submits any final goal edits
router.get('/student/:studentid/goal/:goalid/goal_share', goal_controller.goal_share); //redirect to goal sharing page

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

/*Below are all of the basic functions used to navigate to different URLs*/
router.get('/classPage', student_controller.navigate_to_classPage); //navigates to class page
router.get('/student/:studentid', student_controller.navigate_to_studentProfile); //navigates to a student profile
router.get('/student/:studentid/goal/:goalid', goal_controller.navigate_to_goalProfile); // navigates to a goal within a student profile
router.get('/student/:studentid/createNewGoal', goal_controller.navigate_to_createNewGoal); //navigates to the "create new goal" page
router.get('/createNewStudent', student_controller.navigate_to_createNewStudent); //navigates to new student page
router.get('/sharedWithMe', student_controller.navigate_to_sharedWithMeClassPage); //navigate to class page of shared students
router.get('/sharedWithMe/:studentid', goal_controller.navigate_to_sharedWithMeStudentProfile); //navigate to student profile of shared student
router.get('/sharedWithMe/:studentid/:goalid', goal_controller.navigate_to_sharedWithMeGoalProfile); //navigate to goal profile of shared goal
router.get('/aboutUs', (req, res) => { //navigate to about us page
	User.findById(req.params.userid, function(err, user) {
		res.render('./pages/aboutUs.ejs', {
			user: user
		})
	});
});
router.get('/feedback', (req, res) => { //navigate to feedback page
	User.findById(req.params.userid, function(err, user) {
		res.render('./pages/feedback.ejs', {
			user: user
		})
	});
});
router.get('/settings', (req, res) => { //navigate to settings page
	User.findById(req.params.userid, function(err, user) {
		res.render('./pages/settings.ejs', {
			user: user
		})
	});
});

router.get('/bulkadd', (req, res) => { //navigate to bulkadd page
	User.findById(req.params.userid, function(err, user) {
		res.render('./pages/bulkAdd.ejs', {
			user: user
		})
	});
});


router.get('/testing', (req, res) => { //navigate to testing page - purely used for testing and not accessible by users
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

router.get('/logout', (req, res) => { // logs out of microsoft account and navigates back to log in menu
	var logout = true;
	res.render('pages/index', {
        logout: logout
    });
}); 

module.exports = router;