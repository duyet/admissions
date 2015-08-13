'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sectoritem = mongoose.model('Sectoritem'),
	_ = require('lodash');

/**
 * Create a Sectoritem
 */
exports.create = function(req, res) {
	var sectoritem = new Sectoritem(req.body);
	sectoritem.user = req.user;

	sectoritem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sectoritem);
		}
	});
};

/**
 * Show the current Sectoritem
 */
exports.read = function(req, res) {
	res.jsonp(req.sectoritem);
};

/**
 * Update a Sectoritem
 */
exports.update = function(req, res) {
	var sectoritem = req.sectoritem ;

	sectoritem = _.extend(sectoritem , req.body);

	sectoritem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sectoritem);
		}
	});
};

/**
 * Delete an Sectoritem
 */
exports.delete = function(req, res) {
	var sectoritem = req.sectoritem ;

	sectoritem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sectoritem);
		}
	});
};

/**
 * List of Sectoritems
 */
exports.list = function(req, res) { 
	Sectoritem.find().sort('-created').populate('user', 'displayName').exec(function(err, sectoritems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sectoritems);
		}
	});
};

/**
 * Sectoritem middleware
 */
exports.sectoritemByID = function(req, res, next, id) { 
	Sectoritem.findById(id).populate('user', 'displayName').exec(function(err, sectoritem) {
		if (err) return next(err);
		if (! sectoritem) return next(new Error('Failed to load Sectoritem ' + id));
		req.sectoritem = sectoritem ;
		next();
	});
};

/**
 * Sectoritem authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sectoritem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
