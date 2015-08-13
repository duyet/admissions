'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sectors = require('../../app/controllers/sectors.server.controller');

	// Sectors Routes
	app.route('/sectors')
		.get(sectors.list)
		.post(users.requiresLogin, sectors.create);

	app.route('/sectors/:sectorId')
		.get(sectors.read)
		.put(users.requiresLogin, sectors.hasAuthorization, sectors.update)
		.delete(users.requiresLogin, sectors.hasAuthorization, sectors.delete);

	// Finish by binding the Sector middleware
	app.param('sectorId', sectors.sectorByID);
};
