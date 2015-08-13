'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sector = mongoose.model('Sector'),
	_ = require('lodash');

/**
 * Create a Sector
 */
exports.create = function(req, res) {
	var sector = new Sector(req.body);
	sector.user = req.user;

	sector.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sector);
		}
	});
};

/**
 * Show the current Sector
 */
exports.read = function(req, res) {
	res.jsonp(req.sector);
};

/**
 * Update a Sector
 */
exports.update = function(req, res) {
	var sector = req.sector ;

	sector = _.extend(sector , req.body);

	sector.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sector);
		}
	});
};

/**
 * Delete an Sector
 */
exports.delete = function(req, res) {
	var sector = req.sector ;

	sector.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sector);
		}
	});
};

/**
 * List of Sectors
 */
exports.list = function(req, res) { 
	Sector.find().sort('-created').populate('user', 'displayName').exec(function(err, sectors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sectors);
		}
	});
};

/**
 * Sector middleware
 */
exports.sectorByID = function(req, res, next, id) { 
	Sector.findById(id).populate('user', 'displayName').exec(function(err, sector) {
		if (err) return next(err);
		if (! sector) return next(new Error('Failed to load Sector ' + id));
		req.sector = sector ;
		next();
	});
};

/**
 * Sector authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sector.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
