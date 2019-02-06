const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GoalSchema = new Schema({
	name: {type: String, required: false},
	description: {type: String, required: false},
	studentID: {type: String, require: false},
    percentage: {type: String, required: false},
    //comments: {type: String, required: false}
    goalID: {type: String, required: false}
});

// Export the model
module.exports = mongoose.model('Goal', GoalSchema);