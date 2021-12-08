const express = require("express");
const router = express.Router();
const Article = require("../models/articles");
const User = require("../models/users");
const prepareSomeTags = require('../functions/prepareSomeTags');
const readMinutes = require("../functions/readMinutes");

router.delete('/articles/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Article.findByIdAndDelete(id);
        users = await User.find({ saved: id });
        users.forEach(user => {
            const removeIdFromSavedArray = async (user) => {
                await User.findByIdAndUpdate(user._id, {
                    $pull: {
                        saved: id,
                    }
                }, {
                    new: true
                });
            }
            removeIdFromSavedArray(user);
        });
        res.status(200).redirect('/editor/articles');
    } catch (err) {
        console.log(err);
        res.status(400).render('error');
    }
});

router.patch('/articles/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tags } = req.body;
        const article = await Article.findByIdAndUpdate(id, {
            title: title,
            description: description.trim(),
            tags: prepareSomeTags(tags)
        },{
            new: true
        });
        res.status(200).redirect('/editor/articles');
    } catch (err) {
        console.log(err);
        res.status(400).render("error");
    }
});

router.get('/articles/edit/:id', async (req, res) => {
    try {        
        const { id } = req.params;
        const article = await Article.findById(id);
        res.render('editor/editArticle', { article });
    } catch (err) {
        console.log(err);
        res.status(400).render('error');
    }
});

router.get('/articles', async (req, res) => {
    try {
        const user = await User.findById(res.locals.user._id).populate('articles');
        const articles = user.articles;
        res.status(200).render('editor/articles', { articles });
    }catch(err){
        console.log(err);
        res.status(400).render('error');
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        let prepareTags = prepareSomeTags(tags);
        const article = await Article.create({ 
            title, 
            description, 
            tags: prepareTags, 
            createdAt: new Date(), 
            modifiedAt: new Date(), 
            readMinutes:  readMinutes(description), 
            writer: res.locals.user._id 
        });   

        const newArticleId = article._id; 
        const user = await User.findByIdAndUpdate(res.locals.user._id, {
            $push: { articles : newArticleId },
        },
        {
            new: true,
            upsert: true,
        });
        
        res.status(200).redirect('/editor');
    } catch (err) {
        console.log(err);
        res.status(400).send('Something went wrong...');
    }
});

router.get('/new', (req, res) => {
    res.render('editor/new');
});

router.get('/', (req, res) => {
    res.render('editor/index');
});

module.exports = router;