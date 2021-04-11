const express = require("express");
const router = express.Router();
const pool = require('../config/bd');


router.get("/", async (req, res) => {

    try {
        const { rows: orders } = await pool.query('SELECT orders.*, SUM(basket.price * basket.amount) AS summ FROM orders LEFT JOIN basket ON orders.id = basket.order_id GROUP BY orders.id ORDER BY orders.id DESC', [])
        const { rows: products } = await pool.query('SELECT basket.order_id, basket.price, basket.amount, products.name, products.model FROM basket LEFT JOIN products ON basket.product_id = products.id', [])
        const { rows: orders_logs } = await pool.query('SELECT * FROM orders_logs', [])
        const ordersWithProducts = orders.map(item => {
            const ordersProducts = products.filter(product => product.order_id === item.id)
            const order_logs = orders_logs.filter(log => log.order_id === item.id)
            return {
                ...item,
                ordersProducts,
                order_logs
            }
        })
        res.send(ordersWithProducts)
    } catch (error) {
        console.log(error)
    }
});

router.get("/user/:user_id", async (req, res) => {

    const { user_id } = req.params

    try {
        const { rows: orders } = await pool.query('SELECT orders.*, SUM(basket.price * basket.amount) AS summ FROM orders LEFT JOIN basket ON orders.id = basket.order_id WHERE orders.user_id = $1 AND orders.status != $2 GROUP BY orders.id ', [user_id, 'доставлено'])
        res.send(orders)
    } catch (error) {
        console.log(error)
    }
});

router.put("/info", async (req, res) => {

    const { user_id, address, phone, type, email } = req.body

    try {
        if (address) {
            await pool.query('UPDATE users SET address = $1 WHERE user_id = $2', [address, user_id])
        }
        if (phone) {
            await pool.query('UPDATE users SET phone = $1 WHERE user_id = $2', [phone, user_id])
        }
        if (type) {
            await pool.query('UPDATE users SET type = $1 WHERE user_id = $2', [type, user_id])
        }
        if (email) {
            await pool.query('UPDATE users SET email = $1 WHERE user_id = $2', [email, user_id])
        }
        res.send('Ok')
    } catch (error) {
        console.log(error)
    }
});

router.post("/", async (req, res) => {

    const { user_id } = req.body

    const today = new Date()

    try {
        const userRes = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id])
        const user = userRes.rows[0]
        const number = user.id.toString() + Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
        const orderRes = await pool.query('INSERT INTO orders (contacts, address, date, status, user_id, number, type, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [user.phone, user.address, today, 'обработка', user_id, +number, user.type, user.email])
        const order_id = orderRes.rows[0].id
        await pool.query('UPDATE basket SET order_id = $1 WHERE user_id = $2 AND order_id = 0', [order_id, user_id])
        await pool.query('INSERT INTO orders_logs (order_id, status, text, date) VALUES ($1, $2, $3, $4) RETURNING *', [order_id, 'обработка', 'Новый заказ', today])

        res.json(number)
    } catch (error) {
        console.log(error)
    }
});

router.post("/logs", async (req, res) => {

    const { order_id, status, text } = req.body

    const date = new Date()

    try {
        const orderRes = await pool.query('INSERT INTO orders_logs (order_id, status, text, date) VALUES ($1, $2, $3, $4) RETURNING *', [order_id, status, text, date])
        res.json(orderRes.rows[0])
    } catch (error) {
        console.log(error)
    }
});




module.exports = router;