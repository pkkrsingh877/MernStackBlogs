const express = require('express');
const mongoose = require('mongoose');
const signupErrorHandler = require('../functions/signupErrorHandler');
const loginErrorHandler = require('../functions/loginErrorHandler');
const User = require('../models/users');
const router = express.Router();
const createToken = require('../functions/createToken');
const maxAge = 24 * 60 * 60;

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1});
    res.redirect('/');
});

router.post('/signup', async (req, res) => {
    const { name, username, password, email, img, bio } = req.body;
    console.log(req.body);
    try {
        const data = await User.create({
            name: name,
            username: username,
            password: password,
            email: email,
            img: img,
            bio: bio
        });
        const token = createToken(data._id, maxAge);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ data });
    } catch (err) {
        const signupError = signupErrorHandler(err);
        res.status(400).json({ signupError });
    }
});

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id, maxAge);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const loginError = loginErrorHandler(err);
        res.status(400).json({ loginError });
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/', (req, res) => {
    res.redirect('/auth/login');
});

module.exports = router;


