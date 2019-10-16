/*
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
*  See LICENSE in the source repository root for complete license information.
*/



const PORT = process.env.PORT || 1234
// track.js
const express = require('express');
const bodyParser = require('body-parser');
var User  = require('./models/user.model');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var util = require('util');
var OutlookStrategy = require('passport-outlook').Strategy;
var LocalStrategy   = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");
// initialize our express app
const product = require('./routes/routes'); // Imports routes for the products
const student = require('./controllers/student.controller');
const goal = require('./controllers/goal.controller');
const goaldata = require('./controllers/goaldata.controller');
const user = require('./controllers/user.controller');
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

//Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://TRACK:woofwoofTRACKER7@ds255403.mlab.com:55403/track';
let mongoDB = process.env.MONGO_URI || dev_db_url;
mongoose.connect(mongoDB, ({useNewUrlParser: true}));
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//var app = express();
var morgan = require('morgan');
var path = require('path');

// Initialize variables.
var port = 30662; // process.env.PORT || 30662;

// Configure morgan module to log all requests.
app.use(morgan('dev'));

// Set the front-end folder to serve public assets.
app.use(express.static('JavaScriptSPA'))

//link up route.js file
app.use(product);

// Set up our one route to the index.html file.
app.get('/', (req, res) => {
  res.render('./pages/index.ejs')
}); //navigates back to log in menu
/*
app.get('*', function (req, res) {
  res.render('/index');
    //res.sendFile(path.join(__dirname + '/views/pages/index.html'));
});*/

// Start the server.
app.listen(port);
console.log('Listening on port ' + port + '...');


/*var OUTLOOK_CLIENT_ID = "--insert-outlook-client-id-here--";
var OUTLOOK_CLIENT_SECRET = "--insert-outlook-client-secret-here--";

// navigate to login.ejs
app.get('/', student.run);

//Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://TRACK:woofwoofTRACKER7@ds255403.mlab.com:55403/track';
let mongoDB = process.env.MONGO_URI || dev_db_url;
mongoose.connect(mongoDB, ({useNewUrlParser: true}));
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret:"Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));
passport.use(new OutlookStrategy({
    clientID: OUTLOOK_CLIENT_ID,
    clientSecret: OUTLOOK_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/outlook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Outlook profile is returned
      // to represent the logged-in user.  In a typical application, you would
      // want to associate the Outlook account with a user record in your
      // database, and return that user instead.
      return done(null, profile);
    });
  }
));




app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

/////////////////////////
app.use(passport.initialize());
app.use(passport.session());

app.use(product);
app.use(express.static('public'))

app.listen(PORT, () => {
    console.log('Server is up and running on port number ' + PORT);
});*/