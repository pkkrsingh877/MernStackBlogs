const express = require("express");
const router = express.Router();
const getNewDescription = require("../functions/getNewDescription");
const prepareSomeTags = require("../functions/prepareSomeTags");
const readMinutes = require("../functions/readMinutes");
const Article = require("../models/articles");
const User = require("../models/users");

router.post("/user/requests/decline/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, {
            hasAppliedToBeEditor: false
        },{
            new: true
        });
        console.log(user);
        res.status(200).redirect('/admin/user/requests');
    } catch (err) {
        console.log(err);
        res.status(400).render('error');
    }
});

router.post("/user/requests/accept/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, {
            role: 'editor'
        },{
            new: true
        });
        console.log(user);
        res.status(200).redirect('/admin/user/requests');
    } catch (err) {
        console.log(err);
        res.status(400).render('error');
    }
});

router.get("/user/requests", async (req, res) => {
    try {
        const users = await User.find({ hasAppliedToBeEditor: true, role: 'user' });
        console.log(users);
        res.status(200).render('admin/userRequests', { users });
    } catch (err) {
        console.log(err);
        res.status(400).render('error');
    }
});

router.patch("/articles/edit/:id", async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const { id } = req.params;
        const article = await Article.findByIdAndUpdate(
            id,
            {
                title: title,
                description: description,
                modifiedAt: new Date(),
                tags: prepareSomeTags(tags),
                readMinutes: readMinutes(description),
            },
            {
                new: true,
                upsert: true,
            }
        );
        res.status(200).redirect("/admin/articles");
    } catch (error) {
        console.log(error);
        res.status(400).render("error");
    }
});

router.get("/articles/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id);
        res.render("admin/editArticle", { article });
    } catch (err) {
        res.status(404).render("error");
    }
});

router.delete("/articles/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Article.findByIdAndDelete(id);
        res.redirect("/admin/articles");
    } catch (err) {
        res.status(404).render("error");
    }
});

router.get("/articles", async (req, res) => {
    const articles = await Article.find({}).sort({ createdAt: 1 });
    res.render("admin/articles", { articles });
});

router.post("/", async (req, res) => {
    const { title, description, tags } = req.body;
    try {
        let prepareTags = prepareSomeTags(tags);
        let minutes = readMinutes(description);
        const article = await Article.create({
            title: title,
            description: description,
            createdAt: new Date(),
            modifiedAt: new Date(),
            readMinutes: minutes,
            tags: prepareTags,
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
        
        res.redirect("/admin");
    } catch (err) {
        console.log(err);
        res.status(404).render('error');
    }
});

router.get("/new", (req, res) => {
    res.render("admin/new");
});

router.get("/", (req, res) => {
    res.render("admin/index");
});

module.exports = router;
