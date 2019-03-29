const express = require('express');
const router = express.Router();

// Require the controllers
const goal_controller = require('../controllers/goal.controller');
const student_controller = require('../controllers/student.controller');
const goaldata_controller = require('../controllers/goaldata.controller');
const misc_controller = require('../controllers/misc.controller');
const user_controller = require('../controllers/user.controller')
const Student = require('../models/student.model');

//TODO: figure out the real difference between router.post and router.get
router.post('/student/create', student_controller.student_create); //adds new student to database
router.post('/student/:id/goal/create', goal_controller.goal_create); //adds new goal to database
router.post('/student/:id/goal/:goalid/goaldata/create', goaldata_controller.goaldata_create); //adds new goal datapoint to database
router.post('/signUp/createUser',user_controller.createUser);
//Delete data
router.get('/student/:id/goal/:goalid/delete',goal_controller.goal_delete);//WHY CAN'T I USE ROUTER.DELETE
//router.delete('/goal/delete',goal_controller.goal_delete);
//router.post('/goal/:goalid/delete', goal_controller.goal_delete); //TODO: deletes goal from datapoint
router.get('/student/:id/delete', student_controller.student_delete); //TODO: deletes goal from datapoint
//router.get('/login_confirm',user_controller.login_confirm)
//router.get('/profile',user_controller.get_profile)
//router.get('/logout',user_controller.logout)
//GET request can be cached and remains in browser history. This is why GET is not suppose to use for sensitive data (passwords, ATM pins etc). GET are suppose to use to retrieve data only.
//router.get('/test', student_controller.student_details); // a simple test url to check that all of our files are communicating correctly.

router.get('/classPage', student_controller.navigate_to_classPage);
//router.get('/classPage1', student_controller.navigate_to_classPage1); // navigates to the class page
router.get('/student/:id', student_controller.navigate_to_studentProfile); //navigates to a student profile
router.get('/student/:id/goal/:goalid', goal_controller.navigate_to_goalProfile); // navigates to a goal within a student profile
router.get('/student/:id/createNewGoal', goal_controller.navigate_to_createNewGoal); //navigates to the "create new goal" page
router.get('/createNewStudent',student_controller.navigate_to_createNewStudent); //navigates to new student page 

router.get('/aboutUs', (req, res) => { 
	res.render('./pages/aboutUs.ejs') 
});
router.get('/feedback', (req, res) => { 
	res.render('./pages/feedback.ejs') 
});
router.get('/settings', (req, res) => { 
	res.render('./pages/settings.ejs') 
});
router.get('/signup', (req, res) => { 
	res.render('./pages/signup.ejs') 
});

router.get('/login', misc_controller.login); //log's in, then navigates to class page
router.get('/logout', (req, res) => {
	res.render('./pages/login.ejs')
}); //navigates back to log in menu



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

	return Promise.try(() => {
        return db("vegetables").limit(3);
    }).map((row) => {
        return row.name;
    }).then((vegetables) => {
        res.render("testing", {
            vegetables: vegetables
        });
    });

/*
	var students = [];
	Student.find({}, {}, function(err, student) {
            student.forEach(function(s) { 
                students.push(s);
            });
        });
	res.render('./pages/testing.ejs', {
		students: students,
		test: ["test1", "test2"]
	})*/
});

module.exports = router;