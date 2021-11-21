const express = require("express");
const router = express.Router();
const User = require("../models/users");
const checkUser = require('../middlewares/checkUserMiddleware');

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