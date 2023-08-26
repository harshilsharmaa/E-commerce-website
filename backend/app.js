const dotenv = require('dotenv');
dotenv.config({path: './config/.env'});
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');



// Connecting to the database
const connectDB = require('./config/database');
connectDB();

app.use(express.json({ extended: false , limit: '50mb'}));
app.use(cookieParser());


// importing routes
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
// const orderRouter = require('./routes/order');


// using routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);


module.exports = app;