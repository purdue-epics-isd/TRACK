const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StudentSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: false},
    grade: {type: String, required: false},
    dob: {type: Date, required: false},
    email: {type: String, required: false},
    goals: [{type: Schema.ObjectId, ref: 'Goal'}],
    shared: {type: Boolean, required: true},
    sharedWith: [{type: String}],
    userid: {type: String, required: true}
});

// Export the model
module.exports = mongoose.model('Student', StudentSchema);