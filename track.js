const PORT = process.env.PORT || 1234
// track.js
const express = require('express');
const bodyParser = require('body-parser');
var User  = require('./models/login.model');
var session = require('express-session');
var passport = require('passport');
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
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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