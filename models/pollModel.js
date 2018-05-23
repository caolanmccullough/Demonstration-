const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollSchema = new Schema({
	pollID: {
		type: String,
		unique: true,
		required: true
	},
	pollName: {
		type: String, 
		required: true
	},
	lessonCode: {
		type: String,
	    unique: true,	
		required: true
	},
});

//Create collection and add schema 
const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;