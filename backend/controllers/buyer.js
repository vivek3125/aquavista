const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { CATEGORY } = require('../../src/utility.js');

const getProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product does not exist!' });
        }
        const user = await User.findById(req.user._id);
        if (!user || !user.cart) {
            return res.status(404).json({ error: 'User cart not found!' });
        }
        const cartItem = user.cart.find(item => item.product.toString() === productId.toString());
        res.status(200).json({ message: "Single Product fetched!", product: product, AddOrRemove: cartItem ? true : false });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
}


const getprofile = async (req, res) => {
    const _id = req.user._id;
    // console.log("_id "+_id);
    try {
        const user = await User.findOne({ _id: _id });
        if (!user) {
            return res.status(404).json({ error: 'User not found !' });
        }
        res.status(200).json({ message: 'User Profile Fetched !', user: user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
};

const editprofile = async (req, res) => {
    // image, full name, email id, mobile number, address, userid
    try {
        const _id = req.user._id;
        const user = await User.findById(_id);
        const { userid, fullname, email, phonenumber, address } = req.body;
        const userimage = req.files[0].filename;
        if (user.userid !== userid) {
            const anotherprofile = await User.findOne({ userid: userid });
            if (anotherprofile) {
                return res.status(404).json({ error: 'User already exists with this User ID !' });
            }

        }
        const checkemail = await User.findOne({ email: email });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
};

const getcart = async (req, res) => {
    const _id = req.user._id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found !' });
        }
        const cart = user.cart;
        const response = [];
        try {
            await Promise.all(cart.map(async p => {
                try {
                    let product = await Product.findById(p.product);
                    if (product) {
                        product = product._doc;
                        response.push({ product: { ...product }, time: p.time });
                    }
                } catch (err) {
                    console.log(err);
                }
            }));
            response.reverse();
        } catch (err) {
            console.log(err);
        }
        res.status(200).json({ message: 'Cart items fetched !', cart: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }

};

const addtocart = async (req, res) => {
    try {
        const _id = req.user._id;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: "User not found !" });
        }
        const productId = req.params.productId;
        const cartItem = user.cart.find(item => item.product.toString() === productId.toString());
        if (cartItem) {
            return res.status(200).json({ message: 'Already Added !' });
        }
        const cart = user.cart;
        const updatedCart = [...cart]; // make deep copy of array later 
        updatedCart.push({
            product: productId,
            time: new Date(),
        })
        user.cart = updatedCart;
        await user.save();
        res.status(200).json({ message: 'Added to Cart !', cart: updatedCart });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
};

const deletecart = async (req, res) => {
    try {
        const productId = req.params.productId;
        const _id = req.user._id;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: "User not found !" });
        }
        const cart = user.cart;
        const updatedCart = cart.filter(p => p.product.toString() !== productId.toString());
        user.cart = updatedCart;
        await user.save();
        res.status(200).json({ message: 'Cart item deleted !', cart: updatedCart });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
};

// return object will be content : [{ product, cartState }]
const getCategoryProducts = async (req, res) => {
    try {
        const _id = req.user._id;
        const value = req.params.value;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found !' });
        }
        const products = await Product.find({ category: value });
        const content = [];
        products.map(product => {
            const cartItem = user.cart.find(item => item.product.toString() === product._id.toString());
            cartItem ? content.push({ product: product, cartState: true }) : content.push({ product: product, cartState: false });
        })
        res.status(200).json({ message: 'Category product fetched !', content: content });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
}



const recentexplored = async (req, res) => {
    try {
        const _id = req.user._id;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: 'User doesnot exist !' });
        }
        const recentExplored = user.recentExplored;
        const response = [];
        try {
            await Promise.all(recentExplored.map(async p => {
                try {
                    let product = await Product.findById(p.product);
                    if (product) {
                        product = product._doc;
                        response.push({ product: { ...product } });
                    }
                } catch (err) {
                    console.log(err);
                }
            }));
            response.reverse();
        } catch (err) {
            console.log(err);
        }
        if (response.length === 0) {
            return res.status(404).json({ error: 'No Product Explored !' });
        }
        res.status(200).json({ message: 'Recently explored fetched !', products: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
}

const addcategory = async (req, res) => {
    try {
        const _id = req.user._id;
        const { category } = req.body;
        let check = 0;
        for (let i of CATEGORY) {
            if (i === category) {
                check = 1;
                break;
            }
        }
        if (check === 0) {
            return res.status(404).json({ error: 'No such category exists !' });
        }
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found !' });
        }
        const categorieslist = user.mostExploredCategory;
        const updated = [...categorieslist];
        let ispresent = 0;
        let length = updated.length;
        for (let i = 0; i < length; i++) {
            if (updated[i].category === category) {
                ispresent = 1;
                updated[i].quantity = updated[i].quantity + 1;
            }
        }
        if (!ispresent) {
            updated.push({
                category: category,
                quantity: 1,
            });
            if (length > 5) { updated = updated.shift(); }
        }
        user.mostExploredCategory = updated;
        await user.save();
        res.status(200).json({ message: 'Added to most explored category !' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' })
    }
}

const getExploredCategories = async (req, res) => {
    try {
        const _id = req.user._id;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found !' });
        }
        // Fetch mostExploredCategory and sort by quantity in descending order
        const topCategories = user.mostExploredCategory.sort((a, b) => b.quantity - a.quantity).slice(0, 4);

        res.status(200).json({ message: 'Fetched most explored category !', categories: topCategories });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' })
    }
}

const addsearchedtext = async (req, res) => {
    try {
        const _id = req.user._id;
        const { text } = req.body;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found !' });
        }
        const searchedtextarray = user.recentSearched;
        const updated = [...searchedtextarray];
        updated.push({
            searchedtext: text,
        })
        if (updated.length > 15) {
            updated = updated.shift();
        }
        user.recentSearched = updated;
        await user.save();
        res.status(200).json({ message: 'seached text added to recent searched !' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' })
    }
}

const addrecentexplored = async (req, res) => {
    try {
        const _id = req.user._id;
        const { productId } = req.body;
        // console.log("productId = "+productId);
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found !' });
        }
        let updated = user.recentExplored.filter(item => item.product._id.toString() !== productId);
        updated.push({ product: productId });
        if (updated.length > 15) {
            // updated = updated.shift();
            updated.splice(0, updated.length - 15); // Remove oldest items if more than 15
        }
        user.recentExplored = updated;
        await user.save();
        res.status(200).json({ message: 'Product added into recently explored !' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' })
    }
}

const getOrders = async (req, res) => {
    const _id = req.user._id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found !' });
        }
        const order = user.productsBuy;
        const response = [];
        try {
            await Promise.all(order.map(async p => {
                try {
                    let product = await Product.findById(p.product);
                    if (product) {
                        product = product._doc;
                        response.push({ product: { ...product }, time: p.time });
                    }
                } catch (err) {
                    console.log(err);
                }
            }));
        } catch (err) {
            console.log(err);
        }
        res.status(200).json({ message: 'Ordered items fetched !', order: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
}

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth:{
        user: process.env.SMTP_MAIL, 
        pass: process.env.SMTP_PASSWORD,
    }
})

const requestOrder = async (req, res) => {
    try {
        const { sellerEmail, title, userEmail, userName } = req.body;
        console.log(sellerEmail, title, userEmail,userName);        
        const message = `This is regarding the request to buy your posted book on aquavista whose name is ${title}. 
        My name is ${userName}`;
        const subject = `Request order for ${title}`;
        var mailOptions = {
            from: userEmail,
            to: sellerEmail,
            subject: subject,
            text: message,
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email Send successfully !!');
                res.status(200).json({ message: 'Mail send !' });
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error ! ' });
    }
}

const sendOTP = async (req, res) => {
    try{
        const { sellerEmail, title, userEmail, userName } = req.body;
        console.log(sellerEmail, title, userEmail,userName);        
        let randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        randomNumber = randomNumber.toString();
        const message = `Here is your OTP ${randomNumber} for Aquavista to confirm the order of book named ${title}
            for the user named : ${userName}, and email : ${userEmail} `;
        const subject = `OTP to confirm order for ${title}`;
        var mailOptions = {
            from: userEmail,
            to: sellerEmail,
            subject: subject,
            text: message,
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email Send successfully !!');
                res.status(200).json({ message: 'Mail send !', otp : randomNumber });
            }
        })
    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Internal Server Error !'});
    }
}

const confirmOrder = async (req, res) => {
    try{
        // mark the product as sold 
        // add that product into product buyed 
        const { productId } = req.body;
        console.log(productId);
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ error : 'Product not found !'});
        }
        product.sold = 1;
        product.save();
        const _id = req.user._id;
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).json({ error : 'User not found !'});
        }
        user.productsBuy.push({
            product : productId, 
            time : new Date(),
        })
        user.save();
        res.status(200).json({ message : 'Finally Product Buyed !!', product : product });
    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Internal Server Error !'});
    }
}

const postreview = async (req, res) => {
    try {
        const { value, description, sellerId } = req.body;
        const user = await User.findById(sellerId);
        user.rating.sum = user.rating.sum + value;
        user.rating.count = user.rating.count + 1;
        await user.save();
        res.status(200).json({ message: 'Review Added !' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Intenal Server Error !' });
    }
}

module.exports = {
    getProduct,
    getprofile,
    editprofile,
    getcart,
    addtocart,
    deletecart,
    getCategoryProducts,
    recentexplored,
    addcategory,
    getExploredCategories,
    addsearchedtext,
    addrecentexplored,
    getOrders,
    requestOrder,
    sendOTP,
    confirmOrder,
    postreview,
}