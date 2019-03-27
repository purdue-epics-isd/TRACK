const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const goal = require('/controllers/goal.controller');

let StudentSchema = new Schema({
    name: {type: String, required: true},
    period: {type: String, required: true},
    grade: {type: Number, required: true},
    age: {type: Number, required: false},
    goals: [{type: Schema.ObjectId, ref: 'Goal'}]
});


// Export the model
module.exports = mongoose.model('Student', StudentSchema);