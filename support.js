// file for performing operations on database for testing purposes
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => {
    console.log("DB Connection Successful!")
})
.catch((error) => {
    console.log(error);
});

const Question = require('./models/questions');

const deleteComments = async () => {
    const questions = await Question.find({});
    console.log('---------------found all questions--------------');
    questions.forEach(question => {
        console.log(question)
        const deleteOne = async (id) => {
            await Question.findByIdAndUpdate(id, {
                $set: { comments: [] }
            }, {
                new: true
            });
            console.log('---------------deleting--------------');
        }
        deleteOne(question._id);
    });
    console.log('---------------deletion complete--------------');
} 

deleteComments();