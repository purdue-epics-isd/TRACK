const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GoaldataSchema = new Schema({    
    name: {type: String, required:false},
    description: {type: String, required:false},
    goalID: {type: String, required:false},
    percentage: {type: Number, required:false, max: 100},
    comments: {type: String, required:false},
    time: {type: Date}
});

// Export the model
module.exports = mongoose.model('Goaldata', GoaldataSchema);