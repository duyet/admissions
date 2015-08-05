'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var groupItems = require('../../app/controllers/group-items.server.controller');

	// Group items Routes
	app.route('/group-items')
		.get(groupItems.list)
		.post(users.requiresLogin, groupItems.create);

	app.route('/group-items/:groupItemId')
		.get(groupItems.read)
		.put(users.requiresLogin, groupItems.hasAuthorization, groupItems.update)
		.delete(users.requiresLogin, groupItems.hasAuthorization, groupItems.delete);

	// Finish by binding the Group item middleware
	app.param('groupItemId', groupItems.groupItemByID);
};
