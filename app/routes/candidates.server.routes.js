'use strict';

var ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production 
var bruteforce = new ExpressBrute(store);



module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var candidates = require('../../app/controllers/candidates.server.controller');

	var client = require('redis').createClient()
	var limiter = require('express-limiter')(app, client)

	limiter({
	  path: '/candidates',
	  method: 'post',
	  lookup: ['connection.remoteAddress'],
	  // 2 requests per second
	  total: 2,
	  expire: 1000
	});

	// Candidates Routes
	app.route('/candidates')
		.get(bruteforce.prevent, candidates.list)
		.post(bruteforce.prevent, users.requiresLogin, candidates.create);

	app.route('/candidates/:candidateId')
		.get(candidates.read)
		.put(users.requiresLogin, candidates.hasAuthorization, candidates.update)
		.delete(users.requiresLogin, candidates.hasAuthorization, candidates.delete);

	// Finish by binding the Candidate middleware
	app.param('candidateId', candidates.candidateByID);
};
