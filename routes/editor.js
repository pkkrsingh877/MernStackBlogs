const express = require("express");
const router = express.Router();
const Article = require("../models/articles");
const prepareSomeTags = require('../functions/prepareSomeTags');
const readMinutes = require("../functions/readMinutes");

router.post('/', async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        let prepareTags = prepareSomeTags(tags);
        const article = await Article.create({ title, description, tags: prepareTags, createdAt: new Date(), modifiedAt: new Date(), readMinutes:  readMinutes(description) });    
    } catch (err) {
        console.log(err);
        res.status(400).send('Something went wrong...');
    }
    res.end();
});

router.get('/new', (req, res) => {
    res.render('editor/new');
});

router.get('/', (req, res) => {
    res.render('editor/index');
});

module.exports = router;