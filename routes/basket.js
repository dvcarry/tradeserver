const express = require("express");
const router = express.Router();
const pool = require('../config/bd');


router.get("/:user_id", async (req, res) => {

    const { user_id } = req.params

    try {
        const { rows: products } = await pool.query('SELECT basket.*, products.name, products.model FROM basket LEFT JOIN products ON basket.product_id = products.id WHERE user_id = $1 AND order_id = $2', [user_id, 0])
        res.send(products)
    } catch (error) {
        console.log(error)
    }
});


router.post("/", async (req, res) => {

    const { user_id } = req.body;

    try {
        const { rows: product } = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id])
        const basketRes = await pool.query('SELECT * FROM basket WHERE user_id = $1 and order_id = $2', [user_id, 0])
        const isBasketHasProduct = basketRes.rows.some(item => item.product_id === product[0].basket_product)
        if (isBasketHasProduct) {
            res.send('В корзине уже есть этот товар')
        } else {
            await pool.query('INSERT INTO basket (user_id, order_id, product_id, price, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, 0, product[0].basket_product, product[0].basket_price, 1])
            res.send('Ok')
        }        
        
    } catch (error) {
        console.log(error)
    }
});

router.put("/temp", async (req, res) => {

    const { user_id, product_id, amount, price } = req.body;

    try {
        await pool.query('UPDATE users SET basket_product = $1, basket_amount = $2, basket_price = $3 WHERE user_id = $4', [product_id, amount, price, user_id])
        res.send('Ok')
    } catch (error) {
        console.log(error)
    }
});

router.put("/temp/product", async (req, res) => {

    const { user_id, product_id } = req.body;
    console.log("🚀 ~ file: basket.js ~ line 50 ~ router.put ~ product_id", product_id, user_id)

    try {
        await pool.query('UPDATE users SET basket_product = $1 WHERE user_id = $2', [product_id, user_id])
        res.send('Ok')
    } catch (error) {
        console.log(error)
    }
});

router.put("/amount", async (req, res) => {

    const { user_id, type } = req.body;

    const amount = type === 'plus' ? 1 : -1

    try {
        const { rows: user } = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id])
        const currentProduct = user[0].basket_product
        const productRes = await pool.query('SELECT amount FROM products WHERE id = $1', [productRes])
        const totalAmount = productRes.rows[0].amount
        const basketProductRes = await pool.query('SELECT amount FROM basket WHERE id = $1', [currentProduct])
        const currentAmount = basketProductRes.rows[0].amount
        const notGoToMinus = currentAmount !== 0 || type === 'plus'
        // const notToUnavailableAmount = type === 'plus' && totalAmount 
        if (notGoToMinus) {
            await pool.query('UPDATE basket SET amount = amount + $1 WHERE user_id = $2 AND id = $3', [amount, user_id, currentProduct])
        } 
        res.json({ currentProduct })
    } catch (error) {
        console.log(error)
    }
});

router.delete("/:user_id", async (req, res) => {

    const { user_id } = req.params;

    try {
        const { rows: user } = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id])
        await pool.query('DELETE FROM basket WHERE id = $1', [user[0].basket_product])
        res.send('Ok')
    } catch (error) {
        console.log(error)
    }
});

router.delete("/whole/:user_id", async (req, res) => {

    const { user_id } = req.params;

    try {
        await pool.query('DELETE FROM basket WHERE user_id = $1 and order_id = 0', [user_id])
        res.send('Ok')
    } catch (error) {
        console.log(error)
    }
});



module.exports = router;