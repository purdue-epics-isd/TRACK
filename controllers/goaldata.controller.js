const GoalData = require('../models/goaldata.model');
const Goal = require('../models/goal.model');
const Student = require('../models/student.model');

exports.goaldata_create = function (req, res) {
    let goaldata = new GoalData(
        {
            goalID: req.params.goalid,
            percentage: req.body.percentage,
            support: req.body.support,
            comments: req.body.comments,
            time: Date.now()
        }
    );

    console.log(goaldata);

    goaldata.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            Student.findById(req.params.id, function(err, student) {
                var goals = [];
                Goal.find({studentID: req.params.id}, {}, function(err, goal) {
                    goal.forEach(function(s) { 
                        console.log("Goal: " + s);
                        console.log("Student ID: " + s.studentID + "|" + s.name);
                        console.log("req.params.id: " + req.params.id + "|" + student.name);
                        goals.push(s);
                    });
                    //console.log("Here is the final list:" + goals);
                });

                res.render('pages/studentProfile', {
                    student: student,
                    goals: goals
                });
            });
        }
    });
};

/*exports.goaldata_details = function (req, res) {
    Goaldata.findById(req.params.id, function (err, goal) {
        if (err) return next(err);
        res.send(goaldata);
    })
};*/

/*exports.goaldata_name = function (req, res) {
    Student.findById(req.params.id, function(err, goal) {
        res.render('pages/goalProfile', {
            goaldata: goaldata
        });
    });
}*/

exports.goaldata_delete = function (req, res) {
    console.log(req.body.id)
    Goaldata.findByIdAndRemove(req.body.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};