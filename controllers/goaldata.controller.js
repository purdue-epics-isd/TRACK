const GoalData = require('../models/goaldata.model');
const Goal = require('../models/goal.model');
const Student = require('../models/student.model');
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
const User = require('../models/user.model');

const storage = new GridFsStorage({
	url: 'mongodb+srv://purdue.epics.isd.track@gmail.com:Woofwoof7!!!!@track-dev.4dk1e.mongodb.net/TRACK-dev?retryWrites=true&w=majority',
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
exports.goaldata_create = function (req, res) {
    try {
        let goaldata = new GoalData(
            {
                goalID: req.params.goalid,
                score: req.body.score,
                count: req.body.count,
                rubricOption: req.body.optionsRadios,
                support: req.body.support,
                comments: req.body.comments,
                time: Date.now(),
                teacherEmail: req.body.useremail
            }
        );

        console.log(req.file);

        Goal.findOneAndUpdate({_id: req.params.goalid}, {$push: {goaldata: goaldata}}, function (err, goal) {
            console.log("\nGoal to be updated: " + goal);
            console.log("\nGoaldata to be added: " + goaldata);
            //console.log("\nTeacher email: " + req.body.useremail);

            goaldata.save(function (err) { 
                if (err) {
                    res.send(err);
                }
            });
        });

        upload.single(req.body.file), function (req, res) {
            // req.file is the name of your file in the form above, here 'uploaded_file'
            // req.body will hold the text fields, if there were any 
            console.log(req.file, req.body)
         };
        console.log("is shared?: " + req.params.shared);
        //console.log("evaluate: " + (type(req.params.shared)));
        if(req.params.shared == "true") {
            console.log("navigating to shared student profile...");
            res.redirect("/sharedWithMe/" + req.params.studentid);
        } else {
            console.log("navigating to personal student profile...");
            res.redirect("/student/" + req.params.studentid);
        }
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};

exports.goaldata_delete = function (req, res) {
    try {
        //console.log(req.body.id)
        GoalData.findByIdAndRemove(req.params.goaldataid, function (err) {
            if (err) return next(err);
            res.redirect('/student/' + req.params.studentid + '/goal/' + req.params.goalid);
        })
    } catch(err) {
        console.log(err);
        res.render('/error');
    }
};