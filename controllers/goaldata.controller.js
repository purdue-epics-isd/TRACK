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
                time: Date.now()
            }
        );

        console.log("percentage: " + req.body.percentage);
        console.log("support: " + req.body.support);

        //console.log(goaldata);

        Goal.findOneAndUpdate({_id: req.params.goalid}, {$push: {goaldata: goaldata}}, function (err, goal) {
            console.log("Goal to be updated: " + goal);
            console.log("goaldata to be added: " + goaldata);
            goaldata.save(function (err) { 
                if (err) {
                    res.send(err);
                }
            });
        });

        /*
        Student.findById(req.params.studentid, function(err, student) {
            var goals = [];
            Goal.find({studentID: req.params.studentid}, {}, function(err, goal) {
                goal.forEach(function(s) { 
                    console.log("Goal: " + s);
                    console.log("Student ID: " + s.studentID + "|" + s.name);
                    console.log("req.params.studentid: " + req.params.studentid + "|" + student.name);
                    goals.push(s);
                });
                //console.log("Here is the final list:" + goals);
            });

            res.render('pages/studentProfile', {
                student: student,
                goals: goals
            });
        });*/
        res.redirect("/student/" + req.params.studentid);
    } catch(err) {
        console.log(err);
        res.render('./error');
    }
};

/*exports.goaldata_details = function (req, res) {
    Goaldata.findById(req.params.studentid, function (err, goal) {
        if (err) return next(err);
        res.send(goaldata);
    })
};*/

/*exports.goaldata_name = function (req, res) {
    Student.findById(req.params.studentid, function(err, goal) {
        res.render('pages/goalProfile', {
            goaldata: goaldata
        });
    });
}*/

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