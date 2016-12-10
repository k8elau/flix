/*
list of things to do 
    
- for the future:
- FIGURE OUT WHY MIXITUP DOESN'T WORK 
*/

// order of doing things (installing stuff on node)
/*
npm install http-server -g 
npm init *creates node project* *press enter a bunch of times*
npm install express --save *gets express running*
npm install express-handlebars *enable templating in express*
npm install nodemon -g *lets you use nodemon index.js to run thing*
npm install body-parser *used for parsing through form data*
npm install --save multer *the image uploading package*
npm install mongoose --save *used for accessing the database on mlab*
npm install mongoose-url-slugs *the package that slugifies things*
npm install dotenv --save *for loading the .env file which holds the database*
*/

var express = require('express');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var Mongoose = require('mongoose');

var app = express();

//requires to .env file and letting website know that we need it
require('dotenv').config();

//Mongoose connecting to database, mongoDB helping out too
Mongoose.connect(process.env.DB_URL);

var portNum = 8888;
app.set('port', portNum);

// tell express to use handlebars
app.engine('handlebars', hbs({defaultLayout: 'main'}) );
app.set('view engine', 'handlebars');

//http://stackoverflow.com/questions/35668409/node-js-post-request-for-input-array
//made it true because of that stackoverflow answer (genre array input)

app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

//when user visits "/shows", refer to .routes/shows

var show = require('./routes/shows');
app.use('/shows', show);

var options={};
var auth = require('./routes/auth')(app, options);
auth.init(); //setup middleware
auth.registerRoutes();


//accesses src files in public folder (e.g. could be css, images)
app.use(express.static('public'));

// start server
app.listen(portNum, function() {
  console.log('listening on port ', portNum);
});



