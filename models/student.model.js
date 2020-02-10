const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const goal = require('/controllers/goal.controller');

let StudentSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: false},
    period: {type: String, required: false},
    grade: {type: String, required: false},
    dob: {type: Date, required: false},
    email: {type: String, required: false},
    goals: [{type: Schema.ObjectId, ref: 'Goal'}],
    userid: {type: String, required: true}, 
    documentation: [{ data: Buffer, contentType: String }]
});


// Export the model
module.exports = mongoose.model('Student', StudentSchema);