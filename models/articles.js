const mongoose = require('mongoose');
//create schema
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please, Enter the title"]
    },
    description: {
        type: String,
        required: [true, "Please, Enter the description"]
    },
    // category: {
    //     type: String
    // },
    tags: [String],
    readMinutes: Number,
    createdAt: {
        type: Date
    },
    modifiedAt: {
        type: Date
    },
    comments: [{
        name: { type: String, required: [true, "Please, Enter your name"] },
        email: { type: String, default: "" },
        comment: { type: String, required: [true, "Please, Enter the comment"] },
        createdAt: { type: Date, default: Date.now }
      }]
});
//create model
const Article = new mongoose.model('Article', articleSchema);
module.exports = Article;