'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Matriculate Schema
 */
var MatriculateSchema = new Schema({
	// Matriculate model fields   
	// ...
	student_name: {
		type: String,
		default: '',
		//required: 'Please fill Candidate name',
		trim: true
	},
	student_id: {
		type: String,
		default: '',
		//required: 'Please fill Candidate name',
		trim: true
	},
	school_code: {
		type: String,
		default: '',
		//required: 'Please fill Candidate name',
		trim: true
	},
	faculty_code: {
		type: String,
		default: '',
		//required: 'Please fill Candidate name',
		trim: true
	},
	score_priority: {
		type: Number,
		default: 0,
		//required: 'Please fill Candidate name',
		trim: true
	},
	score_sum: {
		type: Number,
		default: 0,
		//required: 'Please fill Candidate name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('Matriculate', MatriculateSchema);