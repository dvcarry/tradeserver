const express = require("express");
const router = express.Router();
const pool = require('../config/bd');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post("/", async (req, res) => {

    const { login, password } = req.body

    try {

        const { rows: user } = await pool.query("SELECT * FROM admins WHERE login = $1", [login])

        if (user.length === 0 || !user) {
            return res.status(400).json({ message: 'Нет пользователя с таким логином' })
        }

        // const isMatch = await bcrypt.compare(password, user[0].password)

        const isMatch = password === user[0].password

        if (!isMatch) {
            return res.status(400).json({ message: 'Неправильный пароль' })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWTSECRET,
        )

        res.json({ token })

    } catch (error) {
        console.log(error)
    }

});


module.exports = router;