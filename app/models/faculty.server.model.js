'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Faculty Schema
 */
var FacultySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Faculty name',
		trim: true
	},
	code: {
		type: String,
		default: '',
		required: 'Please fill Faculty code',
		trim: true,
		unique: true, 
		index: true
	},
	school_name: {
		type: String,
		default: '',
		required: 'Please fill Faculty name',
		trim: true
	},
	school_code: {
		type: String,
		default: '',
		required: 'Please fill Faculty code',
		trim: true,
		unique: true, 
		index: true
	},
	subject_group: [{
		type: String,
		default: '',
		required: 'Please fill Faculty group',
		trim: true
	}],
	quota: {
		type: Number,
		default: 0,
		required: 'Please fill Faculty quota',
		trim: true
	},
	current: {
		type: Number,
		default: 0,
		//required: 'Please fill Faculty quota',
		//trim: true
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

mongoose.model('Faculty', FacultySchema);