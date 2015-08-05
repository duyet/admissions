'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var faculties = require('../../app/controllers/faculties.server.controller');

	// Faculties Routes
	app.route('/faculties')
		.get(faculties.list)
		.post(users.requiresLogin, faculties.create);

	app.route('/faculties/:facultyId')
		.get(faculties.read)
		.put(users.requiresLogin, faculties.hasAuthorization, faculties.update)
		.delete(users.requiresLogin, faculties.hasAuthorization, faculties.delete);

	// Finish by binding the Faculty middleware
	app.param('facultyId', faculties.facultyByID);
};
