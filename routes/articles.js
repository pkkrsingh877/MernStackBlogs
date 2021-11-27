const express = require("express");
const router = express.Router();
const getNewDescription = require("../functions/getNewDescription");
const getIdFromURL = require('../functions/getIdFromURL');
const Article = require("../models/articles");

router.post('/viewcount', async (req, res) => {
    const { url } = req.body;
    const id = getIdFromURL(url);
    const article = await Article.findByIdAndUpdate(id, {$inc : {'views' : 1}}, { new: true, upsert: true});
    res.status(200).end();
});

router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const { comment, user } = req.body;
    const createdAt = Date.now();
    try {
        const data = await Article.findByIdAndUpdate(
            id,
            {
                $push: { comments: [{ comment, user, createdAt }] },
            },
            { new: true, upsert: true }
        );
        console.log(data);
        res.redirect(`/articles/${id}`);
    } catch (err) {
        res.status(404).render("error");
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const article = await Article.findById(id).populate({
            path: 'comments',	
            populate: { 
                path:  'user',
                model: 'User' 
            }
          });
        const comments = article.comments;
        res.status(200).render("articles/show", { article, comments });
    } catch (err) {
        res.status(404).render("error");
    }
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
        const count = await Article.find({ tags: tag }).countDocuments();
        const totalPages = Math.ceil(count / limit);
        if (page > totalPages) {
            temp = totalPages - 1;
            page = totalPages;
        }
        const data = await Article.find({ tags: tag })
            .skip((page - 1) * skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        for (let i = 0; i < data.length; i++) {
            let newStr = getNewDescription(data[i].description);
            data[i].description = newStr;
        }
        res.render("articles/tag", { data, tag, currentPage, totalPages, temp });
    } catch (err) {
        res.status(404).render("error");
    }
});

router.get("/", async (req, res) => {
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
        const count = await Article.countDocuments();

        const totalPages = Math.ceil(count / limit);
        if (page > totalPages) {
            temp = totalPages - 1;
            page = totalPages;
        }

        const data = await Article.find({})
            .skip((page - 1) * skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        for (let i = 0; i < data.length; i++) {
            let newStr = getNewDescription(data[i].description);
            data[i].description = newStr;
        }
        res.render("articles/index", { data, totalPages, currentPage, temp });
    } catch (err) {
        console.log(err)
        res.status(404).render("error");
    }
});

module.exports = router;
