const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if(err){
                res.redirect('/auth/login');
            }else{
                next();
            }
        });
    }else{
        res.redirect('/auth/login');
    }
}

module.exports = authMiddleware;