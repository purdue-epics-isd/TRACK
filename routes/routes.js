const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy   = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");

// Require the controllers
const goal_controller = require('../controllers/goal.controller');
const student_controller = require('../controllers/student.controller');
const goaldata_controller = require('../controllers/goaldata.controller');
const misc_controller = require('../controllers/misc.controller');
const user_controller = require('../controllers/user.controller')
const Student = require('../models/student.model');
const User = require('../models/user.model');
//var userID = sessionStorage.getItem("userID");

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
router.post('/student/:studentid/addDocumentation', student_controller.student_add_documentation); //adds pdfs to student profiles
router.get('/student/:studentid/getPicture', student_controller.student_get_documentation); //retrieve specific photos
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
	res.render('./pages/testing.ejs')
});