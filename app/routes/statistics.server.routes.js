'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var statistics = require('../../app/controllers/statistics.server.controller');

	// Statistics Routes
	app.route('/statistics')
		.get(statistics.list)
		.post(users.requiresLogin, statistics.create);

	app.route('/statistics/:statisticId')
		.get(statistics.read)
		.put(users.requiresLogin, statistics.hasAuthorization, statistics.update)
		.delete(users.requiresLogin, statistics.hasAuthorization, statistics.delete);

	// Finish by binding the Statistic middleware
	app.param('statisticId', statistics.statisticByID);
};
