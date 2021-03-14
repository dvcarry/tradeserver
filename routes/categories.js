const express = require("express");
const router = express.Router();
const pool = require('../config/bd');

router.get("/:parent", async (req, res) => {

    const { parent } = req.params
    console.log("🚀 ~ file: categories.js ~ line 8 ~ router.get ~ parent", parent)

    try {
        const { rows: categories } = await pool.query('SELECT t1.*, t2.name AS parent_name FROM categories t1 LEFT JOIN categories t2 ON t2.id = t1.parent WHERE t1.parent = $1', [parent])
        res.send(categories)
    } catch (error) {
        console.log(error)
    }
});

router.get("/", async (req, res) => {

    try {
        const { rows: categories } = await pool.query('SELECT t1.*, t2.name AS parent_name FROM categories t1 LEFT JOIN categories t2 ON t2.id = t1.parent', [])
        res.send(categories)
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;