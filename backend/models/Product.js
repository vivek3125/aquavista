const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String },
    publicationyear: { type: Number },
    edition: { type: String },
    language: { type: String, required: true },
    category: { type: String, required: true },
    pages: { type: Number, required: true },
    period: { type: String, required: true },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    discount : { type : Number, required : true },
    quantity: { type: Number, required: true },
    desc: { type: String, required: true },
    email: { type: String, required: true },
    phonenumber: { type: String, required: true },
    address: { type: String, required: true }, 
    image1: { type: String, required: false },
    image2: { type: String, required: false },
    image3: { type: String, required: false },
    image4: { type: String, required: false },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // Reference to User schema
    sold : { type : Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.model('product', productSchema);
module.exports = Product;