const express = require('express')
const router = express.Router();
const productController = require('../controllers/product');


// specific category products
router.get('/getCategory/:category', productController.getcategory);
// discount products
router.get('/discount/:value', productController.getdiscountproduct);
// new release products with help of timestamp 
router.get('/newrelease', productController.newrelease);
// under some price on home page 
router.get('/price/:price', productController.productbyprice);
// best deels : product with maximum discount 
router.get('/maxdiscount', productController.maxidiscount);
// get upto discount route 
// router.get('/getuptodiscount/:value', productController.getuptodiscount);

router.get('/:productId', productController.getProduct);


// filtering and seaching will be handled later : to be later 
// whenever any category or link on homepage is clicked, it opens another route of that 


module.exports = router;
