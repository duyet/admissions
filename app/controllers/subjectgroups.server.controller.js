'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Subjectgroup = mongoose.model('Subjectgroup'),
	_ = require('lodash');

/**
 * Create a Subjectgroup
 */
exports.create = function(req, res) {
	var subjectgroup = new Subjectgroup(req.body);
	subjectgroup.user = req.user;

	subjectgroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subjectgroup);
		}
	});
};

/**
 * Show the current Subjectgroup
 */
exports.read = function(req, res) {
	res.jsonp(req.subjectgroup);
};

/**
 * Update a Subjectgroup
 */
exports.update = function(req, res) {
	var subjectgroup = req.subjectgroup ;

	subjectgroup = _.extend(subjectgroup , req.body);

	subjectgroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subjectgroup);
		}
	});
};

/**
 * Delete an Subjectgroup
 */
exports.delete = function(req, res) {
	var subjectgroup = req.subjectgroup ;

	subjectgroup.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subjectgroup);
		}
	});
};

/**
 * List of Subjectgroups
 */
exports.list = function(req, res) { 
	Subjectgroup.find().sort('-created').populate('user', 'displayName').exec(function(err, subjectgroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subjectgroups);
		}
	});
};

/**
 * Subjectgroup middleware
 */
exports.subjectgroupByID = function(req, res, next, id) { 
	Subjectgroup.findById(id).populate('user', 'displayName').exec(function(err, subjectgroup) {
		if (err) return next(err);
		if (! subjectgroup) return next(new Error('Failed to load Subjectgroup ' + id));
		req.subjectgroup = subjectgroup ;
		next();
	});
};

/**
 * Subjectgroup authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.subjectgroup.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
