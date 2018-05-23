const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	userID: {
		type: String,
		unique: true,
		required: true
	},
	lessonCode: {
		type: String,
	    unique: true,	
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	commentID: {
		type: String,
	    unique: true,	
		required: true
	},
});

//Create collection and add schema 
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;