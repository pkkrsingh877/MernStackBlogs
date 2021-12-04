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
        _id: false,
        comment: { type: String, required: [true, "Please, Enter the comment"] },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: Date   
    }],
    views: Number,
    writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
articleSchema.index({title: 'text', description: 'text'});
//create model
const Article = new mongoose.model('Article', articleSchema);
module.exports = Article;