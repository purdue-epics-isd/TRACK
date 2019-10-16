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

//use sessions for tracking logins

var OUTLOOK_CLIENT_ID = "--insert-outlook-client-id-here--";
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


// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/outlook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Outlook authentication will involve
//   redirecting the user to outlook.com.  After authorization, Outlook
//   will redirect the user back to this application at
//   /auth/outlook/callback
app.get('/auth/outlook',
  passport.authenticate('windowslive', { scope: [
    'openid',
    'profile',
    'offline_access',
    'https://outlook.office.com/Mail.Read'
  ] }),
  function(req, res){
    // The request will be redirected to Outlook for authentication, so
    // this function will not be called.
  });

// GET /auth/outlook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/outlook/callback', 
  passport.authenticate('windowslive', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
	done(null,user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});
app.post("/login_confirm", passport.authenticate("local",{
    successRedirect:"/userfile",
    failureRedirect:"/"
}),function(req, res){
    res.send("User is "+ req.user.id);
});

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
});