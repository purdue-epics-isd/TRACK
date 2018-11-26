// track.js
const express = require('express');
const bodyParser = require('body-parser');
// initialize our express app
const product = require('./routes/routes'); // Imports routes for the products
const app = express();

//Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://TRACK:woofwoofTRACKER7@ds255403.mlab.com:55403/track';
let mongoDB = process.env.MONGO_URI || dev_db_url;
mongoose.connect(mongoDB, ({useNewUrlParser: true}));
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(product);
app.use(express.static('public'))

let port = 1234;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});

