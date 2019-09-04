const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const goal = require('/controllers/goal.controller');

let StudentSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    period: {type: String, required: true},
    grade: {type: String, required: true},
    age: {type: String, required: false},
    goals: [{type: Schema.ObjectId, ref: 'Goal'}]
});


// Export the model
module.exports = mongoose.model('Student', StudentSchema);