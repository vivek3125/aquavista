const Product = require('../models/Product');
const User = require('../models/User');
const path = require('path');
const fs = require('fs-extra');


exports.addProduct = async (req, res, next) => {
    let { title, author, publisher, publicationyear, edition, language, category, pages,
        period, mrp, price, quantity, desc, email, phonenumber, address } = req.body;
    let image1, image2, image3, image4;
    try {
        if (!title) {
            return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Title is required' });
        }
        if (!author) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Author is required' }); }
        if (!language) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Language is required' }); }
        if (!category) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Category is required' }); }
        if (!pages) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Pages is required' }); }
        if (!period) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Peroid is required' }); }
        if (!mrp) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'MRP is required' }); }
        if (!price) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Price is required' }); }
        if (!quantity) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Quantity is required' }); }
        if (!desc) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Description must be of atleast 100 length' }); }
        if (!email) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Email is required' }); }
        if (!phonenumber) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Phonenumber is required' }); }
        if (!address) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Address is required' }); }
        if (!req.files[0] || !req.files[1] || !req.files[2] || !req.files[3]) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", message: 'All four images are required' }); }
        else {
            image1 = req.files[0].filename;
            image2 = req.files[1].filename;
            image3 = req.files[2].filename;
            image4 = req.files[3].filename;
        }

        if (isNaN(parseInt(pages)) || parseInt(pages) < 1) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Pages must be a valid positive number' });
        }

        if (publicationyear) {
            if (isNaN(parseInt(publicationyear)) || parseInt(publicationyear) < 1000 || parseInt(publicationyear) > new Date().getFullYear()) {
                return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Publication year must be a valid year' });
            }
            // else { publicationyear = parseInt(publicationyear);}
        }

        if (isNaN(parseFloat(mrp)) || parseFloat(mrp) <= 0) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'MRP must be a valid positive number' });
        }
        // else { mrp = parseFloat(mrp); }
        if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Price must be a valid positive number' });
        }
        // else { mrp = parseFloat(price); }
        if (isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Quantity must be a valid positive integer' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Invalid email format' });
        }

        // Validate mobile number format
        const mobileRegex = /^[0-9]{10}$/; // Assuming mobile number is 10 digits long
        if (!mobileRegex.test(phonenumber)) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Invalid mobile number format' });
        }
        let discount = 0;
        if (mrp >= price) {
            discount = ((mrp - price) / mrp) * 100;
            discount.toFixed(2);
        }
        const product = new Product({
            title, author, publisher, publicationyear: publicationyear ? parseInt(publicationyear) : "", edition, language, category, pages: parseInt(pages),
            period, mrp: parseFloat(mrp).toFixed(2), price: parseFloat(price).toFixed(2), discount: discount, quantity: parseInt(quantity), desc, email, phonenumber, address, image1, image2, image3, image4,
            sellerId: req.user._id,
        });

        const savedProduct = await product.save();
        const _id = req.user._id;
        const user = await User.findOne({ _id: _id });
        if (!user) {
            res.status(400).json({ type: 'Wohps, Something went wrong !', error: 'User Not Found !' });
        }
        const userposted = user.productsPosted;
        const posted = JSON.parse(JSON.stringify(userposted));
        posted.push({
            product: product._id,
            time: new Date(),
        })
        user.productsPosted = posted;
        await user.save();
        res.status(200).json({ message: "product saved !!", product: product });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ type: 'Something went wrong', error: 'Internal Server Error !' });
    }

}


exports.getsoldproducts = async (req, res) => {
    try {
        const payload = req.user;
        const _id = payload._id;
        const user = await User.findOne({ _id: _id });
        const soldproducts = user.productsPosted;
        const response = [];
        try {
            // Promise.all() : it waits for all the promises to return back and then it proceeds 
            await Promise.all(soldproducts.map(async (p) => {
                try {
                    const product = await Product.findOne({ _id: p.product });
                    if (product) {
                        response.push({ ...product });
                    }
                } catch (err) {
                    console.error(`Error fetching product: ${err.message}`);
                }
            }));
        } catch (err) {
            console.error(`Error fetching products: ${err.message}`);
        }
        res.status(200).json({ message: 'All sold products fetched !', products: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error ! ' });
    }
}

exports.getsingleproduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found !' });
        }
        res.status(200).json({ message: 'Product fetched !', product: product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
}

exports.editproduct = async (req, res) => {
    const productId = req.params.productId;
    let { title, author, publisher, publicationyear, edition, language, category, pages,
        period, mrp, price, quantity, desc, email, phonenumber, address } = req.body;

    let image1, image2, image3, image4;
    console.log(req);
    try {
        if (!title) {
            return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Title is required' });
        }
        if (!author) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Author is required' }); }
        if (!language) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Language is required' }); }
        if (!category) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Category is required' }); }
        if (!pages) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Pages is required' }); }
        if (!period) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Peroid is required' }); }
        if (!mrp) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'MRP is required' }); }
        if (!price) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Price is required' }); }
        if (!quantity) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Quantity is required' }); }
        if (!desc) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Description must be of atleast 100 length' }); }
        if (!email) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Email is required' }); }
        if (!phonenumber) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Phonenumber is required' }); }
        if (!address) { return res.status(400).json({ type: "Whoops! Looks like you forgot something.", error: 'Address is required' }); }

        // image1 = req.file[0] ? req.files[0].filename : undefined;
        // image2 = req.file[1] ? req.files[1].filename : undefined;
        // image3 = req.file[2] ? req.files[2].filename : undefined;
        // image4 = req.file[3] ? req.files[3].filename : undefined;


        if (isNaN(parseInt(pages)) || parseInt(pages) < 1) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Pages must be a valid positive number' });
        }

        if (publicationyear) {
            if (isNaN(parseInt(publicationyear)) || parseInt(publicationyear) < 1000 || parseInt(publicationyear) > new Date().getFullYear()) {
                return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Publication year must be a valid year' });
            }
            // else { publicationyear = parseInt(publicationyear);}
        }

        if (isNaN(parseFloat(mrp)) || parseFloat(mrp) <= 0) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'MRP must be a valid positive number' });
        }
        // else { mrp = parseFloat(mrp); }
        if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Price must be a valid positive number' });
        }
        // else { mrp = parseFloat(price); }
        if (isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Quantity must be a valid positive integer' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Invalid email format' });
        }

        // Validate mobile number format
        const mobileRegex = /^[0-9]{10}$/; // Assuming mobile number is 10 digits long
        if (!mobileRegex.test(phonenumber)) {
            return res.status(400).json({ type: "Uh-oh! That doesn't look quite right. Please check your input.", error: 'Invalid mobile number format' });
        }
        let discount = 0;
        if (mrp >= price) {
            discount = ((mrp - price) / mrp) * 100;
            discount.toFixed(2);
        }

        console.log(image1, image2, image3, image4);

        // const updatedProduct = {
        //     title, author, publisher, publicationyear: publicationyear ? parseInt(publicationyear) : "", edition, language, category, pages: parseInt(pages),
        //     period, mrp: parseFloat(mrp).toFixed(2), price: parseFloat(price).toFixed(2), discount: parseFloat(discount), quantity: parseInt(quantity), desc, email, phonenumber, address

        // };

        // const response = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
        // if (!response) {
        //     return res.status(400).json({ error: "Product not updated !" });
        // }
        const response = {};
        res.status(200).json({ message: "product updated !!", product: response });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error !' });
    }

}

// what happens : product deleted, folder managed, product is removed from user posted list 
exports.deleteproduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        console.log(productId);
        const response = await Product.findByIdAndDelete(productId);
        if (response) {
            const userDir = path.join(__dirname, `../public/${req.user._id}/${response.title}`);
            fs.remove(userDir, (err) => {
                if (err) {
                    console.error('Error deleting product folder:', err);
                } else {
                    // console.log("Product folder deleted!");
                }
            });
            const user = await User.findById(req.user._id);
            const productposted = JSON.parse(JSON.stringify(user.productsPosted));
            const updatedpostedproducts = productposted.filter(product => product.product.toString() !== response._id.toString());
            console.log(updatedpostedproducts);
            user.productsPosted = updatedpostedproducts;
            await user.save();
            return res.status(200).json({ message: 'Product deleted successfully', product: response });
        }
        res.status(404).json({ error: 'Product not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};