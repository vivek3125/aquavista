const GoogleStrategy = require('passport-google-oauth20');
const passport = require('passport');
require("dotenv").config();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID, 
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ["profile","email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const fullname = profile.displayName;
                let user = await User.findOne({ userid: email });
                if (!user) {
                    const newUser = new User({
                        userid:  email,
                        fullname: fullname,
                        email : email, 
                    });
                    user = await newUser.save();
                }
                return done(null, user);
            }catch(err){
                console.log("Inside google  stretegy error block !", err);
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

