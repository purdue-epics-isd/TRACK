const Goal = require('../models/goal.model');

exports.goal_create = function (req, res) {
    let goal = new Goal(
        {
            percentage: req.body.percentage,
            support: req.body.support,
            comments: req.body.comments,
            time: Date.now()
        }
    );

    goal.save(function (err) {
        if (err) {
            if(err )
            res.send(err);
        } else {
            res.send(goal);
        }
    })
};

exports.goal_details = function (req, res) {
    Goal.findById(req.params.id, function (err, goal) {
        if (err) return next(err);
        res.send(goal);
    })
};

exports.goal_delete = function (req, res) {
    console.log(req.body.id)
    Goal.findByIdAndRemove(req.body.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};