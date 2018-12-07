const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GoalSchema = new Schema({
    percentage: {type: Number, required: false, max: 100},
    support: {type: String, required: false},
    comments: {type: String, required: false},
    time: {type: Date}
});

// Export the model
module.exports = mongoose.model('Goal', GoalSchema);