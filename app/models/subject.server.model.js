'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Subject name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	status:{
		type: Number,
		default: 0,
		//required: 'Please fill School name',
		//trim: true
	},
	// user: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// }
});

mongoose.model('Subject', SubjectSchema);