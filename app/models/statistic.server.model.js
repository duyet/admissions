'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Statistic Schema
 */
var StatisticSchema = new Schema({
	key: {
		type: String,
		default: '',
	},
	value: {
		type: Number,
		default: 0,
	},
	name: {
		type: String,
		default: '',
	},
	view: {
		type: Number,
		default: 0,
	},
	modified: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('Statistic', StatisticSchema);