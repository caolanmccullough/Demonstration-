const mongoose = require('mongoose');

//Map Global Promises
mongoose.Promise = global.Promise;

//Connect To Mongoose
const connection = mongoose.createConnection(`mongodb://localhost/dddd`);

connection.on('connected', () => {
  console.log('connected to mongodb');
});

connection.on('disconnected', () => {
  console.log('connection disconnected');
});