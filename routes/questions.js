const express = require('express');
const Question = require('../models/questions');
const prepareSomeTags = require('../functions/prepareSomeTags');
const getIdFromURL = require('../functions/getIdFromURL');
const getNewDescription = require('../functions/getNewDescription');
const router = express.Router();

router.post('/viewcount', async (req, res) => {
    const { url } = req.body;
    const id = getIdFromURL(url);
    const question = await Question.findByIdAndUpdate(id, {$inc : {'views' : 1}}, { new: true, upsert: true});
    res.status(200).end();
});

router.get("/tags/:tag", async (req, res) => {
    const { tag } = req.params;
    let { page, skip, limit } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    skip = parseInt(skip);
    if (!page || page < 0) {
        page = 1;
    }
    if (!skip || skip < 0) {
        skip = 4;
    }
    if (!limit || limit < 0) {
        limit = 4;
    }
    const currentPage = parseInt(page);
    let temp = currentPage;
    if (temp != 1) {
        temp--;
    }
    try {
        const count = await Question.find({ tags: tag }).countDocuments();
        const totalPages = Math.ceil(count / limit);
        if (page > totalPages) {
            temp = totalPages - 1;
            page = totalPages;
        }
        const questions = await Question.find({ tags: tag })
            .skip((page - 1) * skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        for (let i = 0; i < questions.length; i++) {
            let newStr = getNewDescription(questions[i].description);
            questions[i].description = newStr;
        }
        res.render("questions/tags", { questions, tag, currentPage, totalPages, temp });
    } catch (err) {
        console.log(err)
        res.status(404).render("error");
    }
});

router.get('/new', async (req, res) => {
    if(res.locals.user){
        res.render('questions/new');
    }else{
        res.redirect('/auth/login');
    }
});

router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const { comment, user } = req.body;
    console.log(req.body);
    const createdAt = Date.now();
    try {
        const data = await Question.findByIdAndUpdate(
            id,
            {
                $push: { comments: [{ comment, user, createdAt }] },
            },
            { new: true, upsert: true }
        );
        res.redirect(`/questions/${id}`);
    } catch (err) {
        res.status(404).render("error");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const currentUser = res.locals.user;
    try {
        const question = await Question.findById(id).populate({
            path: 'comments',	
            populate: { 
                path:  'user',
                model: 'User' 
            }
          });
          console.log(question);
          const comments = question.comments;
        res.render('questions/show', { question, comments, currentUser });
    } catch (err) {
        res.status(404).render("error");
    }
});

router.post('/', async (req, res) => {
    if(res.locals.user){
        try {
            const { title, description, tags } = req.body;
            let prepareTags = prepareSomeTags(tags);
            const question = await Question.create({
                title: title, 
                description: description,
                tags: prepareTags,
                questioner: res.locals.user._id
            });
            res.status(200).redirect("/questions");
        } catch (err) {
            console.log(err);
            res.status(400).send('Something went wrong...');
        }
    }else{
        res.redirect('/auth/login');
    }
});

router.get('/', async (req, res) => {
    try {
        let { page, skip, limit } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        skip = parseInt(skip);
        if (!page || page < 0) {
            page = 1;
        }
        if (!skip || skip < 0) {
            skip = 4;
        }
        if (!limit || limit < 0) {
            limit = 4;
        }
        const currentPage = parseInt(page);
        let temp = currentPage;
        if (temp != 1) {
            temp--;
        }

        const count = await Question.countDocuments();

        const totalPages = Math.ceil(count / limit);
        if (page > totalPages) {
            temp = totalPages - 1;
            page = totalPages;
        }

        const questions = await Question.find({}).skip((page - 1) * skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        for (let i = 0; i < questions.length; i++) {
            let newStr = getNewDescription(questions[i].description);
            questions[i].description = newStr;
        }
        res.render('questions/index', { questions, totalPages, currentPage, temp });
    } catch (err) {
        console.log(err);
        res.status(404).render('error');
    }
});

module.exports = router;
