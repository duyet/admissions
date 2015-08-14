'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var apis = require('../../app/controllers/apis.server.controller');

	// Apis Routes
	// app.route('/apis')
	// 	.get(apis.list)
	// 	.post(apis.create);
	app.route('/apis/query')
		.all(apis.matriculate);
	app.route('/apis/matriculate')
		.all(apis.domatriculate);
	app.route('/apis/viewschool')
		.all(apis.viewschool);
	app.route('/apis/viewfaculty')
		.all(apis.viewfaculty);
	app.route('/apis/findcandidates')
		.all(apis.findcandidates);
	app.route('/apis/initialization')
		.all(apis.initialization);
	app.route('/apis/opportunity')
		.all(apis.opportunity);
	app.route('/apis/initschoolsfortest')
		.all(apis.initschoolsfortest);
	app.route('/apis/initschools')
		.all(apis.initschools);
		
//users.requiresLogin,
	// app.route('/apis/:apiId')
	// 	.get(apis.read)
	// 	.put(users.requiresLogin, apis.hasAuthorization, apis.update)
	// 	.delete(users.requiresLogin, apis.hasAuthorization, apis.delete);

	// Finish by binding the Api middleware
	// app.param('apiId', apis.apiByID);
};
