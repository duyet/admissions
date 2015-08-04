'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Candidate = mongoose.model('Candidate'),
	_ = require('lodash');

/**
 * Create a Candidate
 */
exports.create = function(req, res) {
	var candidate = new Candidate(req.body);
	candidate.user = req.user;

	candidate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(candidate);
		}
	});
};

/**
 * Show the current Candidate
 */
exports.read = function(req, res) {
	res.jsonp(req.candidate);
};

/**
 * Update a Candidate
 */
exports.update = function(req, res) {
	var candidate = req.candidate ;

	candidate = _.extend(candidate , req.body);

	candidate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(candidate);
		}
	});
};

/**
 * Delete an Candidate
 */
exports.delete = function(req, res) {
	var candidate = req.candidate ;

	candidate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(candidate);
		}
	});
};

/**
 * List of Candidates
 */
exports.list = function(req, res) { 
	Candidate.find().sort('-created').populate('user', 'displayName').exec(function(err, candidates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(candidates);
		}
	});
};

/**
 * Candidate middleware
 */
exports.candidateByID = function(req, res, next, id) { 
	Candidate.findById(id).populate('user', 'displayName').exec(function(err, candidate) {
		if (err) return next(err);
		if (! candidate) return next(new Error('Failed to load Candidate ' + id));
		req.candidate = candidate ;
		next();
	});
};

/**
 * Candidate authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.candidate.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
