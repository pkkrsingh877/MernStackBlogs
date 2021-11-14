const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try{
        const data = await User.findById(id);
        res.status(200).render('user/profile', { data })
    }catch(err){
        res.status(404).render('error');
    }
});

module.exports = router;