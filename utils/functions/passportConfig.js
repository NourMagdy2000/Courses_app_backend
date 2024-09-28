const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/users.model");
const passport = require('passport');

// Register a Strategy to be passed when authenticate () method is called 
const googleStartegy =passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true,
    scope: ["profile", "email"]
}, 
async function verify (request, accessToken, refreshToken, profile, done){
    try{
        // get the returned data from profile
        let data = profile?._json;
        let user = await User.findOne({email: data.email})

        if(!user){ // create user, if user does not exist
            const newUser = await User.create({
                firstname: data.given_name,
                lastname: data.family_name,
                user_image: data.picture,
                email: data.email
            });
            return await done(null, newUser)

        }
        return await done(null, user)


    }catch(error){
        return done(error, false)
    }
}));

passport.serializeUser((user, done)=>{
    done(null, user)
})

passport.deserializeUser((user, done) =>{
    done(null, user);
});

module.exports={googleStartegy};