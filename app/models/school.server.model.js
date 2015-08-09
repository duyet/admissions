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
		//required: 'Please fill School name',
		//trim: true
	},
	resume:{
		type: Number,
		default: 0,
		//required: 'Please fill School name',
		//trim: true
	},
	candidate:{
		type: Number,
		default: 0,
		//required: 'Please fill School name',
		//trim: true
	},
	matriculated:{
		type: Number,
		default: 0,
		//required: 'Please fill School name',
		//trim: true
	},
	quota:{
		type: Number,
		default: 0,
		//required: 'Please fill School name',
		//trim: true
	},
	largest_benchmark:{
		type: Number,
		default: 0,
		//required: 'Please fill School name',
		//trim: true
	},
	smallest_benchmark:{
		type: Number,
		default: 0,
		//required: 'Please fill School name',
		//trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
	// user: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// }
});

mongoose.model('School', SchoolSchema);