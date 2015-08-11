'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Candidate = mongoose.model('Candidate'),
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
		required: 'Please fill Faculty quota',
		trim: true
	},
	benchmark: {
		type: Number,
		default: 0,
		required: 'Please fill Faculty quota',
		trim: true
	},
	matriculate_list: [Schema.Types.Mixed],
	matriculate:{
		type: Number,
		default: 0,
		required: 'Please fill Faculty quota',
		trim: true
	},
	candidate_apply: Schema.Types.Mixed,
	candidate:{
		type: Number,
		default: 0,
		required: 'Please fill Faculty quota',
		trim: true
	},
	// {
	// 	type: Number,
	// 	default: 0,
	// 	required: 'Please fill Faculty quota',
	// 	trim: true
	// },
	candidate_check: [Schema.Types.Mixed],
	//{
	//	type: [Candidate],
		//ref: 'Candidate'
		//required: 'Please fill Faculty quota',
		//trim: true
	//},

	created: {
		type: Date,
		default: Date.now
	},

	// user: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// }
});

mongoose.model('Faculty', FacultySchema);