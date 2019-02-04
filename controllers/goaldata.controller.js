const goaldata = require('../models/goaldata.model');

exports.goaldata_create = function (req, res) {
    let goaldata = new Goaldata(
        {
            name: req.body.name,
            //description: req.body.description,
            //goalID: req.body.goalID,
            //percentage: req.body.percentagename,
            //support: req.body.support,
            //comments: req.body.comments,
            //time: Date.now()
        }
    );
    goaldata.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            console.log(goaldata);
            /*Student.findById(req.params.id, function(err, student) {
                console.log(student.goals);
                res.render('pages/studentPage', {
                    student: student
                });
            });*/
        }
    });
};

exports.goaldata_details = function (req, res) {
    Goaldata.findById(req.params.id, function (err, goal) {
        if (err) return next(err);
        res.send(goaldata);
    })
};

exports.goaldata_name = function (req, res) {
    Student.findById(req.params.id, function(err, goal) {
        res.render('pages/goalPage', {
            goaldata: goaldata
        });
    });
}

exports.goaldata_delete = function (req, res) {
    console.log(req.body.id)
    Goaldata.findByIdAndRemove(req.body.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};