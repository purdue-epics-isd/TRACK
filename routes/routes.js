const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const goal_controller = require('../controllers/goal.controller');
const student_controller = require('../controllers/student.controller');

router.post('/goal/create', goal_controller.goal_create);
router.post('/student/create', student_controller.student_create);

// a simple test url to check that all of our files are communicating correctly.
router.get('/goal/:id', goal_controller.goal_details);
router.get('/student/:id', student_controller.student_details);

module.exports = router;