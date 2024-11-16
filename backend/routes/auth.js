const express = require('express')
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');
const googlePassport = require('../passport/google-passport');
const facebookPassport = require('../passport/facebook-passport');

// check whether that email and phone number really exists or not in the world 
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/otp', authController.sendOTP);
// router.get('/logout', authController.logout);

// login using google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
    // successRedirect: process.env.CLIENT_URL,
    failureRedirect: "http://localhost:3000"
}), authController.googlelogin);


module.exports = router;