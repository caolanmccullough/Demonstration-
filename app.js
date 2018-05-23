//Build basic express server
var express = require('express');
var session = require('express-session');
//Create app variable setting it to express
var app = express();
//Used for getting data 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Pusher = require('pusher');
//Path used for file paths
const path=require('path');
//Cross domain functionality
const cors =require('cors');

//connect to MongoDB 
mongoose.connect('mongodb://localhost/userDatabase');
var database = mongoose.connection;

//handle mongo error + then connect 
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function () {
});

//Configuration of voting database

require('./config/voteDB');



//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

//Body Parser module is used to read HTTP Post data - its an express middleware that reads forms input data and stores it as a javascript object 
//Body Parser parses the text as URL encoded data 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
app.use(express.static(__dirname + '/public'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});


// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});



app.get('/',function(req,res){      
     res.sendFile('/public/homepage.html', {root: __dirname });
});


//Start Server on Port 80
app.listen(3015, function () {
  console.log('Express app listening on port 3015');
});