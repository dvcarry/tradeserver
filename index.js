const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()


const products = require('./routes/products')
const categories = require('./routes/categories')
const orders = require('./routes/orders')
const responses = require('./routes/responses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const state = require('./routes/state')
const basket = require('./routes/basket')

app.use(cors());
app.use(express.json());


app.use("/api/products", products);
app.use("/api/categories", categories);
app.use("/api/orders", orders);
app.use("/api/responses", responses);
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/state", state);
app.use("/api/basket", basket);


app.listen(5003, () => {
    console.log('server start')
})
