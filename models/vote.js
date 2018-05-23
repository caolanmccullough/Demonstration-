const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VotingSchema = new Schema({
	answer: {
		type: String,
		required: true
	},
	points: {
		type: String, 
		required: true
	}
});

//Create collection and add the schema 
const Vote = mongoose.model('Vote', VotingSchema);

module.exports = Vote;