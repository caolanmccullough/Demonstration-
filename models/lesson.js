const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
	lessonCode: {
		type: String,
		unique: true,
		required: true
	},
	pollID: {
		type: String, 
	    unique: true,	
		required: true
	}
});

//Create collection and add schema 
const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;