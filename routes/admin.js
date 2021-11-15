const express = require("express");
const router = express.Router();
const getNewDescription = require("../functions/getNewDescription");
const prepareSomeTags = require("../functions/prepareSomeTags");
const readMinutes = require("../functions/readMinutes");
const Article = require("../models/articles");

router.patch("/list/:id", async (req, res) => {
    const { title, description, tags, password } = req.body;
    if (password === process.env.PASSWORD) {
        let newTitle = title;
        let newDescription = description;
        let prepareTags = prepareSomeTags(tags);
        let minutes = readMinutes(newDescription);
        const { id } = req.params;
        try {
            const data = await Article.findByIdAndUpdate(
                id,
                {
                    title: newTitle,
                    description: newDescription,
                    modifiedAt: new Date(),
                    tags: prepareTags,
                    readMinutes: minutes,
                },
                {
                    new: true,
                    upsert: true,
                }
            );
        } catch (error) {
            console.log(error);
            res.status(400).render("error");
        }
    }
    res.redirect("/admin/list");
});

router.get("/list/edit/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Article.findById(id);
        res.render("admin/edit", { data });
    } catch (err) {
        res.status(404).render("error");
    }
});

router.delete("/list/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Article.findByIdAndDelete(id);
        res.redirect("/admin/list");
    } catch (err) {
        res.status(404).render("error");
    }
});

router.get("/list", async (req, res) => {
    const data = await Article.find({});
    res.render("admin/list", { data });
});

router.post("/", async (req, res) => {
    const { title, description, tags, password } = req.body;
    try {
        if (password === process.env.PASSWORD) {
            let prepareTags = prepareSomeTags(tags);
            let minutes = readMinutes(description);
            const data = await Article.create({
                title: title,
                description: description,
                createdAt: new Date(),
                modifiedAt: new Date(),
                readMinutes: minutes,
                tags: prepareTags,
            });
        }
        res.redirect("admin");
    } catch (err) {
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
