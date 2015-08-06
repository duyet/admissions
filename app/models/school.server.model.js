'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * School Schema
 */
var SchoolSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill School name',
		trim: true
	},
	code: {
		type: String,
		default: '',
		required: 'Please fill School name',
		trim: true
	},
	faculty_list:{
		type: Schema.ObjectId,
		ref: 'Faculty'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('School', SchoolSchema);