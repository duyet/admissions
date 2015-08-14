'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Statistic = mongoose.model('Statistic'),
	_ = require('lodash');

/**
 * Create a Statistic
 */
exports.create = function(req, res) {
	var statistic = new Statistic(req.body);
	statistic.user = req.user;

	statistic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statistic);
		}
	});
};

/**
 * Show the current Statistic
 */
exports.read = function(req, res) {
	res.jsonp(req.statistic);
};

/**
 * Update a Statistic
 */
exports.update = function(req, res) {
	var statistic = req.statistic ;

	statistic = _.extend(statistic , req.body);

	statistic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statistic);
		}
	});
};

/**
 * Delete an Statistic
 */
exports.delete = function(req, res) {
	var statistic = req.statistic ;

	statistic.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statistic);
		}
	});
};

/**
 * List of Statistics
 */
exports.list = function(req, res) { 
	Statistic.find({key : {$in : ['faculty', 'school', 'candidate', 'student']}})
	.sort('view')
	.populate('user', 'displayName')
	.exec(function(err, statistics) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statistics);
		}
	});
};

/**
 * Statistic middleware
 */
exports.statisticByID = function(req, res, next, id) { 
	Statistic.findById(id).populate('user', 'displayName').exec(function(err, statistic) {
		if (err) return next(err);
		if (! statistic) return next(new Error('Failed to load Statistic ' + id));
		req.statistic = statistic ;
		next();
	});
};

/**
 * Statistic authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.statistic.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
