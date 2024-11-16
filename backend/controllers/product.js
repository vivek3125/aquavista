const Product = require('../models/Product');
const { CATEGORY } = require('../../src/utility.js');
const User = require('../models/User');

const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product does not exist!' });
        }
        res.status(200).json({ message: "Single Product fetched!", product: product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
}


const getcategory = async (req, res) => {
    try {
        const category = req.params.category;
        let check = 0;
        for (let i of CATEGORY ) {
            if(i === category) {
                check = 1;
                break;
            }
        }
        if(check === 0) {
            return res.status(404).json({ error : 'No such category exists !'});
        }
        const products = await Product.find({ category : category });
        if(!products || products.length === 0) {
            return res.status(404).json({ error : 'No Product belongs to this category !'});
        }
        res.status(200).json({ message : 'Category product fetched !', products : products });
    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Internal Server Error !' });
    }
}

const getdiscountproduct = async (req, res) => {
    try{
        let discount = req.params.value;
        discount = parseFloat(discount).toFixed(2);
        const products = await Product.find({ discount: { $gt: discount } }).limit(4);
        if(!products || products.length === 0) {
            return res.status(404).json({ error : 'No product exists for this discount !' });
        }
        res.status(200).json({ message : 'Product with discount fetched !', products : products });
    }catch(err){
        console.log(err);
        req.status(500).json({ error : 'Internal Server Error !' });
    }
}

// const getuptodiscount = async (req, res) => {
//     try {

//     }catch(err){    
//         console.log(err);
//         res.status(500).json({ error : 'Internal Server Error !' });
//     }
// }

const newrelease = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ updatedAt: -1 }).limit(20);
        if(!products || products.length === 0) {
            return res.status(404).json({ error : 'Products not found !'});
        }
        res.status(200).json({ message: 'New release fetched !', products: products });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
}

const productbyprice = async (req, res) => {
    const price = req.params.price;
    try {
        const products = await Product.find({ price: { $lt: price } }).limit(4);
        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'No products found below the specified price.' });
        }
        res.status(200).json({ message: 'Products found below the specified price.', products: products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
}

const maxidiscount = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ discount : -1 }).limit(4);
        if(!products || products.length === 0) {
            return res.status(404).json({ error : 'No products found !'});
        }
        res.status(200).json({ message : 'Product fetched !', products: products });
    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Internal Server Error !' });
    }
}

module.exports = {
    getProduct, 
    getcategory,
    getdiscountproduct,
    newrelease,
    productbyprice,
    maxidiscount,
}


