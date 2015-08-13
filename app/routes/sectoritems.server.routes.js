'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sectoritems = require('../../app/controllers/sectoritems.server.controller');

	// Sectoritems Routes
	app.route('/sectoritems')
		.get(sectoritems.list)
		.post(users.requiresLogin, sectoritems.create);

	app.route('/sectoritems/:sectoritemId')
		.get(sectoritems.read)
		.put(users.requiresLogin, sectoritems.hasAuthorization, sectoritems.update)
		.delete(users.requiresLogin, sectoritems.hasAuthorization, sectoritems.delete);

	// Finish by binding the Sectoritem middleware
	app.param('sectoritemId', sectoritems.sectoritemByID);
};
