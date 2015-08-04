'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Candidate = mongoose.model('Candidate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, candidate;

/**
 * Candidate routes tests
 */
describe('Candidate CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Candidate
		user.save(function() {
			candidate = {
				name: 'Candidate Name'
			};

			done();
		});
	});

	it('should be able to save Candidate instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Candidate
				agent.post('/candidates')
					.send(candidate)
					.expect(200)
					.end(function(candidateSaveErr, candidateSaveRes) {
						// Handle Candidate save error
						if (candidateSaveErr) done(candidateSaveErr);

						// Get a list of Candidates
						agent.get('/candidates')
							.end(function(candidatesGetErr, candidatesGetRes) {
								// Handle Candidate save error
								if (candidatesGetErr) done(candidatesGetErr);

								// Get Candidates list
								var candidates = candidatesGetRes.body;

								// Set assertions
								(candidates[0].user._id).should.equal(userId);
								(candidates[0].name).should.match('Candidate Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Candidate instance if not logged in', function(done) {
		agent.post('/candidates')
			.send(candidate)
			.expect(401)
			.end(function(candidateSaveErr, candidateSaveRes) {
				// Call the assertion callback
				done(candidateSaveErr);
			});
	});

	it('should not be able to save Candidate instance if no name is provided', function(done) {
		// Invalidate name field
		candidate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Candidate
				agent.post('/candidates')
					.send(candidate)
					.expect(400)
					.end(function(candidateSaveErr, candidateSaveRes) {
						// Set message assertion
						(candidateSaveRes.body.message).should.match('Please fill Candidate name');
						
						// Handle Candidate save error
						done(candidateSaveErr);
					});
			});
	});

	it('should be able to update Candidate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Candidate
				agent.post('/candidates')
					.send(candidate)
					.expect(200)
					.end(function(candidateSaveErr, candidateSaveRes) {
						// Handle Candidate save error
						if (candidateSaveErr) done(candidateSaveErr);

						// Update Candidate name
						candidate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Candidate
						agent.put('/candidates/' + candidateSaveRes.body._id)
							.send(candidate)
							.expect(200)
							.end(function(candidateUpdateErr, candidateUpdateRes) {
								// Handle Candidate update error
								if (candidateUpdateErr) done(candidateUpdateErr);

								// Set assertions
								(candidateUpdateRes.body._id).should.equal(candidateSaveRes.body._id);
								(candidateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Candidates if not signed in', function(done) {
		// Create new Candidate model instance
		var candidateObj = new Candidate(candidate);

		// Save the Candidate
		candidateObj.save(function() {
			// Request Candidates
			request(app).get('/candidates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Candidate if not signed in', function(done) {
		// Create new Candidate model instance
		var candidateObj = new Candidate(candidate);

		// Save the Candidate
		candidateObj.save(function() {
			request(app).get('/candidates/' + candidateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', candidate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Candidate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Candidate
				agent.post('/candidates')
					.send(candidate)
					.expect(200)
					.end(function(candidateSaveErr, candidateSaveRes) {
						// Handle Candidate save error
						if (candidateSaveErr) done(candidateSaveErr);

						// Delete existing Candidate
						agent.delete('/candidates/' + candidateSaveRes.body._id)
							.send(candidate)
							.expect(200)
							.end(function(candidateDeleteErr, candidateDeleteRes) {
								// Handle Candidate error error
								if (candidateDeleteErr) done(candidateDeleteErr);

								// Set assertions
								(candidateDeleteRes.body._id).should.equal(candidateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Candidate instance if not signed in', function(done) {
		// Set Candidate user 
		candidate.user = user;

		// Create new Candidate model instance
		var candidateObj = new Candidate(candidate);

		// Save the Candidate
		candidateObj.save(function() {
			// Try deleting Candidate
			request(app).delete('/candidates/' + candidateObj._id)
			.expect(401)
			.end(function(candidateDeleteErr, candidateDeleteRes) {
				// Set message assertion
				(candidateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Candidate error error
				done(candidateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Candidate.remove().exec();
		done();
	});
});