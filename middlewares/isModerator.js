const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

const isModerator = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if(err){
                res.redirect('/');
            }else{
                let user = await User.findById(decodedToken.id);
                if(user.role === 'moderator'){
                    res.locals.user = user;
                    next();
                }else{
                    res.redirect('/');
                }
            }
        });
    }else{
        res.redirect('/');
    }
}

module.exports = isModerator;