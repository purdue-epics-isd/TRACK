const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StudentSchema = new Schema({
    name: {type: String, required: true},
    period: {type: Number, required: true},
    grade: {type: Number, required: true},
    age: {type: Number, required: false},
    goals: [{type: Schema.ObjectId, required: false}]
});


// Export the model
module.exports = mongoose.model('Student', StudentSchema);