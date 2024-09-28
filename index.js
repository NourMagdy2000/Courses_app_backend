const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("models/users.model");

passport.use(new GoogleStrategy({
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

// const googleStartegy=require('/utils/functions/passportConfig');
// googleStartegy.passportConfig();


// const { MongoClient } = require('mongodb');
// const client = new MongoClient(url);
app.use(passport.initialize());
// ////mongoose connect



// const main = async () => {
//     await client.connect();
//     console.log('connected');
//     const db = client.db('Couses-managment');
//     const courses = db.collection('Courses');
//     courses.insertOne({ title: 'java', price: 200 });
//     let data = await courses.find().toArray();
//     console.log(data);
// }

// main();

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log('Mongoose connected') }).catch((err) => { console.log(err) });



const httpStatusText = require('./utils/strings/httpStatusText');



app.use('/about',
    (req, res, next) => {
        console.log('METHOD', req.method, 'URL', req.url), 'this is in about only !';
        next();

    }
)
const coursesRouter = require('./routes/courses.routes');
const usersRouter = require('./routes/users_routes');
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);
app.all('*', (req, res) => {
    res.status(404).json({ "status": httpStatusText.ERROR, "data": null, "msg": "Route not found !" });
})
app.use((error, req, res, next) => { res.status(error.statusCode || 500).json({ "status": error.statusText || httpStatusText.ERROR, "status_code": error.statusCode || 500, "data": null, "msg": error.message }) })
app.listen(process.env.PORT, () => { console.log('listing on port 5001') });