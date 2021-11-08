const mongoose = require('mongoose');
//create schema
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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
        name: { type: String, default: "anonymous" },
        email: { type: String, default: "" },
        comment: { type: String, default: ":)" },
        createdAt: { type: Date, default: Date.now }
      }]
});
//create model
const Article = new mongoose.model('Article', articleSchema);
module.exports = Article;