const express = require("express");
const router = express.Router();
const pool = require('../config/bd');

router.get("category/:category", async (req, res) => {

    const { category } = req.params

    try {
        if (category == 0) {
            const { rows: products } = await pool.query('SELECT products.*, categories.name AS category FROM products LEFT JOIN categories ON products.category_id = categories.id', [])
            res.send(products)
        } else {
            const { rows: products } = await pool.query('SELECT * FROM products WHERE category_id = $1', [category])
            res.send(products)
        }
    } catch (error) {
        console.log(error)
    }
});

router.get("/:product_id", async (req, res) => {

    const { product_id } = req.params

    try {
        const { rows: product } = await pool.query('SELECT products.*, categories.name AS category FROM products LEFT JOIN categories ON products.category_id = categories.id WHERE products.id = $1', [product_id])
        res.send(product[0])

    } catch (error) {
        console.log(error)
    }
});

router.get("/model/:model", async (req, res) => {

    const { model } = req.params
    console.log("🚀 ~ file: products.js ~ line 38 ~ router.get ~ model", model)

    try {
        const { rows: product } = await pool.query('SELECT products.*, categories.name AS category FROM products LEFT JOIN categories ON products.category_id = categories.id WHERE products.model = $1', [model])
        res.send(product[0])

    } catch (error) {
        console.log(error)
    }
});

router.get("/", async (req, res) => {

    try {
        const { rows: products } = await pool.query('SELECT products.*, categories.name AS category FROM products LEFT JOIN categories ON products.category_id = categories.id', [])
        res.send(products)

    } catch (error) {
        console.log(error)
    }
});

router.post("/", async (req, res) => {

    const { name, description, model, amount, price, availability, category_id } = req.body;

    try {
        const { rows: product } = await pool.query(
            'INSERT INTO products (name, description, model, amount, price, availability, category_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [name, description, model, amount, price, availability, category_id]
        )
        res.send(product[0])
    } catch (error) {
        console.log(error)
    }
});

router.put("/", async (req, res) => {

    const { name, description, model, amount, price, availability, category_id, id } = req.body;

    try {
        const { rows: product } = await pool.query(
            'UPDATE products SET name = $1, description = $2, model = $3, amount = $4, price = $5, availability = $6, category_id = $7 WHERE id = $8',
            [name, description, model, amount, price, availability, category_id, id]
        )
        res.send(product[0])
    } catch (error) {
        console.log(error)
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await pool.query("DELETE FROM products WHERE id = $1", [id])
        res.status(201).send('Ok');
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;