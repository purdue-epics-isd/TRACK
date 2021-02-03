const PORT = process.env.PORT || 1234

const express = require('express');
const bodyParser = require('body-parser');

// initialize our express app
const product = require('./routes/routes'); // Imports routes for the products
const student = require('./controllers/student.controller');
var forceSsl = require('force-ssl-heroku');
const app = express();

app.use(forceSsl);
app.set('views', './views');
app.set('view engine', 'ejs');

// navigate to .ejs
app.get('/', student.run);

//Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://track:Woofwoof@track-dev-shard-00-00.4dk1e.mongodb.net:27017,track-dev-shard-00-01.4dk1e.mongodb.net:27017,track-dev-shard-00-02.4dk1e.mongodb.net:27017/TRACK-dev?ssl=true&replicaSet=atlas-1467wp-shard-0&authSource=admin&retryWrites=true&w=majority';
let mongoDB = process.env.MONGO_URI || dev_db_url;
mongoose.connect(mongoDB, ({
	useNewUrlParser: true,
	useUnifiedTopology: true
}));
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(product);
app.use(express.static('public'))

app.listen(PORT, () => {
	console.log('Server is up and running on port number ' + PORT);
});