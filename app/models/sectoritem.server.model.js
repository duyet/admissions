'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sectoritem Schema
 */
var SectoritemSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Sectoritem name',
		trim: true
	},
	code: {
		type: String,
		default: '',
		required: 'Please fill Sectoritem code',
		trim: true
	},
	sector_code: {
		type: String,
		default: '',
		required: 'Please fill Sectoritem sector',
		trim: true
	},
	status:{
		type: Number,
		default: 0,
		//required: 'Please fill School name',
		//trim: true
	},
	// created: {
	// 	type: Date,
	// 	default: Date.now
	// },
	// user: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// }
});

mongoose.model('Sectoritem', SectoritemSchema);