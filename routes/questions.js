const express = require('express');
const Question = require('../models/questions');
const prepareSomeTags = require('../functions/prepareSomeTags')
const router = express.Router();

router.get('/new', async (req, res) => {
    res.render('questions/new');
});

router.post('/', async (req, res) => {
    const { title, description, tags } = req.body;
    let prepareTags = prepareSomeTags(tags);
    const question = await Question.create({
        title: title, 
        description: description,
        tags: prepareTags
    });
    res.status(200).redirect("/questions");
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const question = await Question.findById(id);
    res.render('questions/show', { question });
});

router.get('/', async (req, res) => {
    const questions = await Question.find({});
    res.render('questions/index', { questions });
});

module.exports = router;
