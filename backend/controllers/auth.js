const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const nodemailer = require('nodemailer');
require('dotenv').config();

// handling the login route 
exports.login = async (req, res, next) => {
    try {
        const { userid, password } = req.body;
        if(!userid){
            return res.status(401).json({ message: "Enter userId",prevValues: {userid: userid, password: ""}});
        }
        const user = await User.findOne({ userid: userid });
        if (!user) {
            return res.status(401).json({ message: "User not found !",prevValues: {userid: userid, password: ""}});
        }
        // compare password using User custom function 
        if(!user.comparePassword(password)) {
            return res.status(401).json({ message : 'Password doesnot matched !' });
        }
        const payload = {
            _id : user._id,
        };
        const token = generateToken(payload);
        console.log(token);
        res.status(200).json({ message: "User found !", user: user, token: token });
    } catch (err) {
        console.log("inside login api ", err);
        res.status(500).json({ error: "an error occured during login !" });
    }
}

// handling the singup route 
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^[0-9]{10}$/;
function isValidUserId(value) {
    return emailPattern.test(value) || mobilePattern.test(value);
}  
exports.signup = async (req, res, next) => {
    try {
        // console.log(req);
        const { userid, fullname, password } = req.body;
        if(!userid || !isValidUserId(userid)){
            return res.status(400).json({message: "Invalid mobile number or email formate",prevValues:{userid: userid, fullname: fullname, password: ""}});
        }
        if(!fullname || fullname.trim() === ""){
            return res.status(400).json({message: "Full name is required",prevValues:{userid: userid, fullname: fullname, password: ""}})
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters",prevValues:{userid: userid, fullname: fullname, password: ""}});
        }

        const existingUser = await User.findOne({ userid: userid });
        if (existingUser) {
            return res.status(400).json({message: "Mobile number or email already exists.",prevValues:{userid: userid, fullname: fullname, password: ""}});
        }
        const user = new User({
            userid,
            fullname,
            password,
        });
        const savedUser = await user.save();

        const payload = {
            _id : user._id,  // check whether to use savedUser or user  
        }
        const token = generateToken(payload);
        console.log(token);
        res.status(200).json({ message: "User saved successfully !!", token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error !' });
    }
}

exports.googlelogin = async (req, res) => {
    try{   
        const user = req.user;
        if(user){
            const payload = {
                _id : req.user._id,
            }
            const token = generateToken(payload);
            // console.log(token);
            const currentTime = new Date();
            const expiryTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
            res.cookie('token', JSON.stringify({ value : token , expiryTime : expiryTime.getTime() }), {
                expires : expiryTime,
            }).redirect(process.env.CLIENT_URL);
        }
    }catch(err){
        console.log(err);
        res.redirect(process.env.CLIENT_URL);
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
exports.sendOTP = async (req, res) => {
    try{
        const userid = req.body.userid;
        console.log(userid);
        let randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        randomNumber = randomNumber.toString();
        const message = 'Here is your OTP for Aquavista ' + randomNumber;
        if(emailPattern.test(userid)){
            var mailOptions = {
                from : process.env.SMTP_MAIL,
                to: userid,
                subject: 'OTP for aquavista',
                text: message,
            }
            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    console.log(error);
                }else{
                    console.log('Email Send successfully !!');
                    res.status(200).json({ message : 'Mail send !', otp: randomNumber });
                }
            })
        }
        // else{
        //     const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
        //     const response = await client.messages.create({
        //         body : message, 
        //         from: ,
        //         to: userid,
        //     });
            
        // }
        

    }catch(err){
        console.log(err);
        res.status(500).json({ error : 'Internal Server Error ! '});
    }
}