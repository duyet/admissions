'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Candidate Schema
 */
var CandidateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Candidate name',
		trim: true
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

mongoose.model('Candidate', CandidateSchema);