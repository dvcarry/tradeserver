const express = require("express");
const router = express.Router();
const pool = require('../config/bd');

router.get("/", async (req, res) => {

    try {
        const { rows: users } = await pool.query('SELECT * FROM users', [])
        res.send(users)
    } catch (error) {
        console.log(error)
    }
});

router.post("/", async (req, res) => {

    const { user_id } = req.body;

    try {
        const { rows: users } = await pool.query('SELECT * FROM users WHERE user_id =$1', [user_id])
        if (user.length === 0) {
            const { rows: user } = await pool.query('INSERT INTO users (user_id) VALUES ($1) RETURNING *', [user_id])
            res.send(user[0])
        } else {
            res.send('Ok')
        }


        res.send(product[0])
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;