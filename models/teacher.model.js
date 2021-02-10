const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TeacherSchema = new Schema({
    students: [{ type: Schema.ObjectId, ref: 'Student' }],
    shared: { type: Boolean, required: true },
    sharedWith: [{ type: String }],
    userid: { type: String, required: true }
});

// Export the model
module.exports = mongoose.model('Teacher', TeacherSchema);