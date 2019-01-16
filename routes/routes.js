const express = require('express');
const router = express.Router();

// Require the controllers
const goal_controller = require('../controllers/goal.controller');
const student_controller = require('../controllers/student.controller');

router.post('/goal/create', goal_controller.goal_create);
router.post('/student/create', student_controller.student_create);
router.post('/goal/delete', goal_controller.goal_delete);

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', student_controller.student_details);
router.get('/goal/:id', goal_controller.goal_name);
//router.get('/student/:id', student_controller.student_details);
router.get('/student/:id', student_controller.student_name);

module.exports = router;
