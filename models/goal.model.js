const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GoalSchema = new Schema({
	goalID: {type: String, required: false},
	name: {type: String, required: false},
	description: {type: String, required: false},
	startDate: {type: String, required: false},
	endDate: {type: String, required: false},
    goalType: {type: String, required: false},
    studentID: {type: String, require: false},
    methodOfCollection: [{type: String, require: false}],
    goaldata: [{type: Schema.ObjectId, ref: 'GoalData'}]
});

// Export the model
module.exports = mongoose.model('Goal', GoalSchema);