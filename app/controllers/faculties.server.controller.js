'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Faculty = mongoose.model('Faculty'),
	_ = require('lodash');

/**
 * Create a Faculty
 */
exports.create = function(req, res) {
	var faculty = new Faculty(req.body);
	var group = req.body.group.split(";");
	console.log(group);
	faculty.group = group;
	faculty.user = req.user;

	faculty.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(faculty);
		}
	});
};

/**
 * Show the current Faculty
 */
exports.read = function(req, res) {
	res.jsonp(req.faculty);
};

/**
 * Update a Faculty
 */
exports.update = function(req, res) {
	var faculty = req.faculty ;

	faculty = _.extend(faculty , req.body);

	faculty.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(faculty);
		}
	});
};

/**
 * Delete an Faculty
 */
exports.delete = function(req, res) {
	var faculty = req.faculty ;

	faculty.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(faculty);
		}
	});
};

/**
 * List of Faculties
 */
exports.list = function(req, res) { 
	Faculty.find().sort('-created').populate('user', 'displayName').exec(function(err, faculties) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(faculties);
		}
	});
};

/**
 * Faculty middleware
 */
exports.facultyByID = function(req, res, next, id) { 
	Faculty.findById(id).populate('user', 'displayName').exec(function(err, faculty) {
		if (err) return next(err);
		if (! faculty) return next(new Error('Failed to load Faculty ' + id));
		req.faculty = faculty ;
		next();
	});
};

/**
 * Faculty authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.faculty.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
