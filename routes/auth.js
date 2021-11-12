const express = require('express');
const mongoose = require('mongoose');
const signupErrorHandler = require('../functions/signupErrorHandler');
const loginErrorHandler = require('../functions/loginErrorHandler');
const User = require('../models/users');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email, img, bio } = req.body;
    try {
        const data = await User.create({
            username: username,
            password: password,
            email: email,
            img: img,
            bio: bio
        });
        console.log(data);
        res.json("Hey! It Worked!");
    } catch (err) {
        const signupError = signupErrorHandler(err);
        res.status(404).render('error', { signupError });
    }
});

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await User.find({ username: username, password: password });
        console.log(data);
        res.send(data);
    } catch (err) {
        const loginError = loginErrorHandler(err);
        res.status(404).render('error', { loginError });
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/', (req, res) => {
    res.redirect('/auth/login');
});

module.exports = router;


