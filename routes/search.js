const express = require("express");
const router = express.Router();
const Question = require('../models/questions');
const Article = require('../models/articles'); 

router.post('/questions', async (req, res) => {
    const { search } = req.body;
    const questions = await Question.find({$text: {$search: search }})
    .limit(10);
    res.status(200).json(questions);
});

router.get('/questions', async (req, res) => {
    res.status(200).render('search/questions');
});

router.post('/articles', async (req, res) => {
    const { search } = req.body;
    const articles = await Article.find({$text: {$search: search }})
    .limit(10);
    res.status(200).json(articles);
});

router.get('/articles', async (req, res) => {
    res.status(200).render('search/articles');
});

router.get('/', (req, res) => {
    res.render('search/search');
});

module.exports = router;