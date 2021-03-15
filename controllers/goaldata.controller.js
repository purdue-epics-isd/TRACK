const GoalData = require('../models/goaldata.model');
const Goal = require('../models/goal.model');
const Student = require('../models/student.model');

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
        
        res.redirect("/student/" + req.params.studentid);
        // if(req.params.shared == "true") {
        //     console.log("navigating to shared student profile...");
        //     res.redirect("/sharedWithMe/" + req.params.studentid);
        // } else {
        //     console.log("navigating to personal student profile...");
        //     res.redirect("/student/" + req.params.studentid);
        // }
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