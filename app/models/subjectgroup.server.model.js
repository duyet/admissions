'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subjectgroup Schema
 */
var SubjectgroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Subjectgroup name',
		trim: true
	},
	status:{
		type: Number,
		default: 0,
		//required: 'Please fill School name',
		//trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	// user: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// }
});

mongoose.model('Subjectgroup', SubjectgroupSchema);