const mongoose = require('mongoose');
//create schema
const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please, Enter the title"]
    },
    description: {
        type: String,
        required: [true, "Please, Enter the description"]
    },
    tags: [String],
    comments: [{
        name: { type: String, required: [true, "Please, Enter your name"] },
        email: { type: String, default: "" },
        comment: { type: String, required: [true, "Please, Enter the comment"] },
      }, {timestamps: true}],
    views: Number  
}, {timestamps: true});
//create model
questionSchema.index({title: 'text', description: 'text'});
const Question = new mongoose.model('Question', questionSchema);
module.exports = Question;