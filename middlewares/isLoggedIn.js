const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

const isLoggedIn = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if(err){
                res.redirect('/auth/login');
            }else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.redirect('/auth/login');
    }
}

module.exports = isLoggedIn;