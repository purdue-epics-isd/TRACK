const express = require('express');
const router = express.Router();

// Require the controllers
const goal_controller = require('../controllers/goal.controller');
const student_controller = require('../controllers/student.controller');
const goaldata_controller = require('../controllers/goaldata.controller');
const misc_controller = require('../controllers/misc.controller');

router.post('/student/create', student_controller.student_create);
router.post('/student/:id/goal/create', goal_controller.goal_create);
router.post('/goaldata/create', goaldata_controller.goaldata_create);
router.post('/goal/delete', goal_controller.goal_delete);
router.get('/login', misc_controller.login); //why can't I post?

//GET request can be cached and remains in browser history. This is why GET is not suppose to use for sensitive data (passwords, ATM pins etc). GET are suppose to use to retrieve data only.
// a simple test url to check that all of our files are communicating correctly.
router.get('/test', student_controller.student_details);
router.get('/classPage', student_controller.class_page);
router.get('/student/:id/goal/:id', goal_controller.goal_name);
router.get('/student/:id/newgoal', goal_controller.goal_new);
//router.get('/goal/:id', goal_controller.goal_name);
//router.get('/student/:id', student_controller.student_details);
router.get('/student/:id', student_controller.student_name);
router.get('/logout', misc_controller.logout);

module.exports = router;