const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// const { MongoClient } = require('mongodb');
// const client = new MongoClient(url);

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