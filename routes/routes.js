const express = require('express');
const router = express.Router();

// Require the controllers
const goal_controller = require('../controllers/goal.controller');
const student_controller = require('../controllers/student.controller');
const goaldata_controller = require('../controllers/goaldata.controller');
const misc_controller = require('../controllers/misc.controller');

//TODO: figure out the real difference between router.post and router.get
router.post('/student/create', student_controller.student_create); //adds new student to database
router.post('/student/:id/goal/create', goal_controller.goal_create); //adds new goal to database
router.post('/goaldata/create', goaldata_controller.goaldata_create); //adds new goal datapoint to database
router.post('/goal/delete', goal_controller.goal_delete); //TODO: deletes goal from datapoint

//GET request can be cached and remains in browser history. This is why GET is not suppose to use for sensitive data (passwords, ATM pins etc). GET are suppose to use to retrieve data only.
//router.get('/test', student_controller.student_details); // a simple test url to check that all of our files are communicating correctly.
router.get('/classPage', student_controller.classPageNavigation); // navigates to the class page
router.get('/student/:id', student_controller.studentProfileNavigation); //navigates to a student profile
router.get('/student/:id/goal/:id', goal_controller.goalProfileNavigation); // navigates to a goal within a student profile
router.get('/student/:id/newgoal', goal_controller.newGoalNavigation); //navigates to the "create new goal" page
router.get('/newStudent',student_controller.new_student); //navigates to new student page 
//router.get('/goal/:id', goal_controller.goal_name);
//router.get('/student/:id', student_controller.student_details);
router.get('/login', misc_controller.login); //navigates to login page
router.get('/logout', misc_controller.logout); //navigates to logout page


module.exports = router;