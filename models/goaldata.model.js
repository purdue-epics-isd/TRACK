const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let goalDataSchema = new Schema({   
    goalID: {type: String, required:true},
    //test: {type: String, required:false},
    score: {type: String, required:false, max: 100},
    count: {type: String, required:false, max: 100},
    rubricOption: {type: String, require: false},
    support: {type: String, required: false},
    comments: {type: String, required:false},
    teacherEmail: {type: String, require:true},
    time: {type: Date}
});

// Export the model
module.exports = mongoose.model('GoalData', goalDataSchema);
