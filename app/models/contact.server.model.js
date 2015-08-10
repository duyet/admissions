'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contact Schema
 */
var ContactSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Contact name',
		trim: true
	},

	email: String,
	school_code: String, 
	student_id: String,
	message: String,

	seen: {
		type: Boolean,
		default: false
	},

	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Contact', ContactSchema);