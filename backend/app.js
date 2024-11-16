// GENERAL IMPORTS
const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { connectionToDatabase } = require('./connection');
const Product = require('./models/Product');
const { authenticateUser } = require('./middleware/auth');


// importing routes and other files
const authRoutes = require('./routes/auth');
const sellerRoutes = require('./routes/seller');
const productRoutes = require('./routes/product');
const buyerRoutes = require('./routes/buyer');

// general app routes 
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));
  


// making a session 
app.use(session({
    secret: "152fdhkq7irlpt0rjriouipq",
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));



// defining routes path
app.use('/auth', authRoutes);

app.use('/seller', authenticateUser, sellerRoutes);
app.use('/buyer', authenticateUser, buyerRoutes);
app.use('/product', productRoutes);

// app.get('/allproducts', async (req ,res) => {
//     try{
//         const products = await Product.find();
//         res.status(200).json({ message: "Get all products !", products: products });
//     }catch(err){
//         console.log(err);
//         res.status(500).json({ error : 'Internal Server Error !'});        
//     }
// })


connectionToDatabase().then(() => console.log('Connected to database !')).catch(err => console.log(err));

app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
});
