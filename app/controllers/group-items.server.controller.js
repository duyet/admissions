'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	GroupItem = mongoose.model('GroupItem'),
	_ = require('lodash');

/**
 * Create a Group item
 */
exports.create = function(req, res) {
	var groupItem = new GroupItem(req.body);
	groupItem.user = req.user;

	groupItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(groupItem);
		}
	});
};

/**
 * Show the current Group item
 */
exports.read = function(req, res) {
	res.jsonp(req.groupItem);
};

/**
 * Update a Group item
 */
exports.update = function(req, res) {
	var groupItem = req.groupItem ;

	groupItem = _.extend(groupItem , req.body);

	groupItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(groupItem);
		}
	});
};

/**
 * Delete an Group item
 */
exports.delete = function(req, res) {
	var groupItem = req.groupItem ;

	groupItem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(groupItem);
		}
	});
};

/**
 * List of Group items
 */
exports.list = function(req, res) { 
	GroupItem.find().sort('-created').populate('user', 'displayName').exec(function(err, groupItems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(groupItems);
		}
	});
};

/**
 * Group item middleware
 */
exports.groupItemByID = function(req, res, next, id) { 
	GroupItem.findById(id).populate('user', 'displayName').exec(function(err, groupItem) {
		if (err) return next(err);
		if (! groupItem) return next(new Error('Failed to load Group item ' + id));
		req.groupItem = groupItem ;
		next();
	});
};

/**
 * Group item authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.groupItem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
