const express = require("express");
const router = express.Router();
const User = require("../models/users");
const checkUser = require('../middlewares/checkUserMiddleware');

router.get('/savedarticles', checkUser, async (req, res) => {
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
        const count = res.locals.user.saved.length;

        const totalPages = Math.ceil(count / limit);
        if (page > totalPages) {
            temp = totalPages - 1;
            page = totalPages;
        }

        let savedArticles = res.locals.user.saved;
        console.log("full", savedArticles);
        const skipAndLimit = (page, skip) => {
            savedArticles = savedArticles.slice((page - 1)*skip, ((page - 1)*skip)+4);
            console.log(page, skip)
            console.log("skip", savedArticles);
            savedArticles = savedArticles.slice(0, 4);
            console.log("limit", savedArticles);
        }    

        skipAndLimit(page, skip);

        res.status(200).render("user/savedArticles", { savedArticles , totalPages, currentPage, temp });
    } catch (err) {
        console.log(err);
        res.status(404).render("error");
    }
});

router.post('/save', checkUser, async (req, res) => {
    try {
        const { articleId } = req.body;
        if(res.locals.user){
            await User.findByIdAndUpdate(res.locals.user._id, {
                $addToSet: {saved: articleId }
            });
        }
        res.status(200).end();
    } catch (err) {
        console.log(err);
        res.status(400).end();
    }
});

router.post('/update', checkUser, async (req, res) => {
    try {
        if(res.locals.user.id){
            const { name, username, email, img, bio } = req.body;
            const user = await User.findByIdAndUpdate(res.locals.user.id, { name, username, email, img, bio }, { new: true});
            console.log(user);
            res.status(200).json({ user: user._id });
        }else{
            res.status(200).redirect('/auth/login');
        }
    } catch (err) {
        console.log(err);
    }
});

router.get('/update', checkUser, async (req, res) => {
    res.render('user/updateProfile.ejs');
});

router.get('/profile', checkUser, async (req, res) => {
    try{
        const data = await User.findById(res.locals.user.id);
        res.status(200).render('user/profile', { data })
    }catch(err){
        res.status(404).render('error');
    }
});

module.exports = router;