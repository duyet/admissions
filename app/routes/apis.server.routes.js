'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var apis = require('../../app/controllers/apis.server.controller');

	// Apis Routes
	app.route('/apis')
		.get(apis.list)
		.post(apis.create);
	app.route('/apis/query')
		.all(apis.matriculate)
		
//users.requiresLogin,
	// app.route('/apis/:apiId')
	// 	.get(apis.read)
	// 	.put(users.requiresLogin, apis.hasAuthorization, apis.update)
	// 	.delete(users.requiresLogin, apis.hasAuthorization, apis.delete);

	// Finish by binding the Api middleware
	app.param('apiId', apis.apiByID);
};
