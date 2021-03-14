const express = require("express");
const router = express.Router();
const pool = require('../config/bd');

router.get("/", async (req, res) => {

    try {
        const { rows: reponses } = await pool.query('SELECT * FROM responses', [])
        res.send(reponses)
    } catch (error) {
        console.log(error)
    }
});

router.post("/", async (req, res) => {

    const { user_id, text } = req.body;

    const date = new Date()

    try {
        const userRes = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id])
        const type = userRes.rows[0].response
        await pool.query('INSERT INTO responses (user_id, date, text, type) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, date, text, type])
        res.send('Ok')
    } catch (error) {
        console.log(error)
    }
});

router.put("/", async (req, res) => {

    const { user_id, type } = req.body;

    try {
        await pool.query('UPDATE users SET response = $1 WHERE user_id = $2', [type, user_id])
        res.send('Ok')
    } catch (error) {
        console.log(error)
    }
});




module.exports = router;