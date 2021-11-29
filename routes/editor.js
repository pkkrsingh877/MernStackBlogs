const express = require("express");
const router = express.Router();
const Article = require("../models/articles");

router.get('/new', (req, res) => {
    res.render('editor/new');
});

router.get('/', (req, res) => {
    res.render('editor/index');
});

module.exports = router;