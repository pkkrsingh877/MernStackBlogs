const express = require('express');
const Question = require('../models/questions');
const router = express.Router();

router.post('/', async (req, res) => {
    const { title, description, tags, password } = req.body;
    res.status(200).send("It's working");
});

router.get('/new', async (req, res) => {
    res.render('questions/new');
});

router.get('/', async (req, res) => {
    const questions = await Question.find({});
    res.render('questions/index', {});
});

module.exports = router;
