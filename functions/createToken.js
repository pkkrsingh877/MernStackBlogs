const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (id, maxAge) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge
        //maxAge is in seconds
    });
}

module.exports = createToken;