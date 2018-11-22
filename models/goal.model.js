const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GoalSchema = new Schema({
    percentage: {type: Number, required: true, max: 100},
    support: {type: Number, required: false},
    comments: {type: String, required: false},
});


// Export the model
module.exports = mongoose.model('Goal', GoalSchema);