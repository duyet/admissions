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
	faculty_list:[Schema.Types.Mixed],
	status:{
		type: Number,
		default: 0,
	},
	resume:{
		type: Number,
		default: 0,
	},
	candidate:{
		type: Number,
		default: 0,
	},
	matriculated:{
		type: Number,
		default: 0,
	},
	quota:{
		type: Number,
		default: 0,
	},
	largest_benchmark:{
		type: Number,
		default: 0,
	},
	smallest_benchmark:{
		type: Number,
		default: 0,
	},
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('School', SchoolSchema);