const express = require("express");
const router = express.Router();
const pool = require('../config/bd');

router.get("/:user_id", async (req, res) => {

    const { user_id } = req.params

    try {
        const { rows: users } = await pool.query('SELECT state FROM users WHERE user_id = $1', [user_id])
        if (users[0]) {
            res.send(users[0].state)
        } else {
            const { rows: user } = await pool.query('INSERT INTO users (user_id) VALUES ($1) RETURNING *', [user_id])
            res.send(user[0].state)
        }

    } catch (error) {
        console.log(error)
    }
});

router.put("/", async (req, res) => {

    const { user_id, state } = req.body;

    try {
        await pool.query('UPDATE users SET state = $1 WHERE user_id = $2', [state, user_id])        
        res.send('Ok')
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;