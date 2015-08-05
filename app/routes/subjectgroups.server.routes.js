'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var subjectgroups = require('../../app/controllers/subjectgroups.server.controller');

	// Subjectgroups Routes
	app.route('/subjectgroups')
		.get(subjectgroups.list)
		.post(users.requiresLogin, subjectgroups.create);

	app.route('/subjectgroups/:subjectgroupId')
		.get(subjectgroups.read)
		.put(users.requiresLogin, subjectgroups.hasAuthorization, subjectgroups.update)
		.delete(users.requiresLogin, subjectgroups.hasAuthorization, subjectgroups.delete);

	// Finish by binding the Subjectgroup middleware
	app.param('subjectgroupId', subjectgroups.subjectgroupByID);
};
