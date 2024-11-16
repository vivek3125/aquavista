const express = require('express')
const router = express.Router();
const sellerController = require('../controllers/seller');
const path = require('path');
const fs = require('fs');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join(__dirname, `../public/${req.user._id}/${req.body.title}`);
        
        // Check if the directory exists, if not, create it
        fs.access(userDir, (err) => {
            if (err) {
                // Directory doesn't exist, create it
                fs.mkdir(userDir, { recursive: true }, (err) => {
                    if (err) {
                        // Error creating directory
                        return cb(err);
                    }
                    // Directory created successfully, proceed
                    cb(null, userDir);
                });
            } else {
                // Directory already exists, proceed
                cb(null, userDir);
            }
        });
    },
    filename: (req, file, cb) => {
        if(!file) return ;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);    
        file.filename = `${file.originalname}-${uniqueSuffix}`;
        cb(null, `${file.originalname}-${uniqueSuffix}`);
    },
});


const upload = multer({storage: storage});
// router.use(upload.none());

// check whether the phone and email entered by seller actually exists or not 
router.post('/product', upload.array("images", 4), sellerController.addProduct);

// router.get('/product/:productId', );  // this will go into single product fetching api into products 
router.get('/products', sellerController.getsoldproducts);
// get this sold product of user using the id
router.get('/product/:productId', sellerController.getsingleproduct);
router.put('/product/:productId', upload.array("images", 4), sellerController.editproduct);

// if the product is not sold out, then seller can delete it 
router.delete('/product/:productId', sellerController.deleteproduct);

// edit product
// delete product
// get list of to be sold products, and already sold products


module.exports = router;
