'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var candidates = require('../../app/controllers/candidates.server.controller');

	// Candidates Routes
	app.route('/candidates')
		.get(candidates.list)
		.post(users.requiresLogin, candidates.create);

	app.route('/candidates/:candidateId')
		.get(candidates.read)
		.put(users.requiresLogin, candidates.hasAuthorization, candidates.update)
		.delete(users.requiresLogin, candidates.hasAuthorization, candidates.delete);

	// Finish by binding the Candidate middleware
	app.param('candidateId', candidates.candidateByID);
};
