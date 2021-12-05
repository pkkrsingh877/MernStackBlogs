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
        _id: false,
        comment: { type: String, required: [true, "Please, Enter the comment"] },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: Date
      }],
    views: Number,
    questioner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});
//create model
questionSchema.index({title: 'text', description: 'text'});
const Question = new mongoose.model('Question', questionSchema);
module.exports = Question;