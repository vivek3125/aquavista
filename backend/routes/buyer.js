const express = require('express');
const buyerController = require('../controllers/buyer');
const router = express.Router();

// get product for buyer separate
router.get('/product/:productId', buyerController.getProduct);
// get profile
router.get('/profile', buyerController.getprofile);
// edit profile 
router.put('/profile', buyerController.editprofile);
// get cart
router.get('/cart', buyerController.getcart);
// post cart 
router.post('/cart/:productId', buyerController.addtocart);
// delete cart items : first from cart view using delete button, and second from remove from cart button on product details, third from cart icon on product card on home page  
router.delete('/cart/:productId', buyerController.deletecart);
// get all products of a particular category : for logged in user
router.get('/category/:value', buyerController.getCategoryProducts);
// recent explored of products ( top 15 )
router.get('/recentexplored', buyerController.recentexplored);
router.post('/recentexplored',buyerController.addrecentexplored);


// recommended products : to be later 
// last searched products, usne jo type krke search kre hai vo vale : to be later  

// CONFUSION for some post request : 
// user without login can click on card to open, click on category nav bar or home page, can search and filter items
// but without login we cannot add those into user account
// but with login we have to do it 
// TO FIX THIS WE CALL API WHENEVER USER IS LOGGED IN 

// add the category into user schema when logged in user click or visit any particular category
router.post('/addcategory', buyerController.addcategory);
// add searched text into users recentSearched when user is logged in 
router.post('/searchedtext', buyerController.addsearchedtext);
// when card is clicked and user is logged in : save it into recentexplored 
router.post('/recentexplored', buyerController.addrecentexplored);



// get orders
// when finally order placed, then it get added into productsbuyed list 
router.get('/order', buyerController.getOrders);

// get mostexplored category
router.get('/exploredcategories',buyerController.getExploredCategories);

                    // EVERYTHING ABOUT PLACING ORDER
// request order will send mail / make a call + button confirm order -> when clicked 2 things open ( input field with finalize button ( with OTP validation timer ) + cancel order )  
// -> when OTP is given, api check and if matched order is finally placed and added to respective arrays -> is cancelled then system is back to initial request order state 

// if wrong OTP then it show wrong OTP entered ( general timer for OTP filling after that field become invisible ) -> resend button for regeneration 

// request order : automated mail will be given to seller describing product details and buyer details 
// cancel order : we click a button to cancel the order 
// confirm order for OTP generation : OTP generated from seller and give it to buyer ( like flipcart delivery concept ) 
// finally place order : this will finalize the order and add into respected arrays of buyer and seller 
router.post('/requestOrder', buyerController.requestOrder);
router.post('/sendOTP', buyerController.sendOTP);
router.post('/confirmOrder', buyerController.confirmOrder);


                    // REVIEW SYSTEM 
// send review : when the order get placed then review form opens and if buyer gives some review then after submitting the form the api will add this review into seller schema along 
// with product id 

router.post('/review/:sellerId', buyerController.postreview);

module.exports = router;
