'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Subjectgroup = mongoose.model('Subjectgroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, subjectgroup;

/**
 * Subjectgroup routes tests
 */
describe('Subjectgroup CRUD tests', function() {
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

		// Save a user to the test db and create new Subjectgroup
		user.save(function() {
			subjectgroup = {
				name: 'Subjectgroup Name'
			};

			done();
		});
	});

	it('should be able to save Subjectgroup instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subjectgroup
				agent.post('/subjectgroups')
					.send(subjectgroup)
					.expect(200)
					.end(function(subjectgroupSaveErr, subjectgroupSaveRes) {
						// Handle Subjectgroup save error
						if (subjectgroupSaveErr) done(subjectgroupSaveErr);

						// Get a list of Subjectgroups
						agent.get('/subjectgroups')
							.end(function(subjectgroupsGetErr, subjectgroupsGetRes) {
								// Handle Subjectgroup save error
								if (subjectgroupsGetErr) done(subjectgroupsGetErr);

								// Get Subjectgroups list
								var subjectgroups = subjectgroupsGetRes.body;

								// Set assertions
								(subjectgroups[0].user._id).should.equal(userId);
								(subjectgroups[0].name).should.match('Subjectgroup Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Subjectgroup instance if not logged in', function(done) {
		agent.post('/subjectgroups')
			.send(subjectgroup)
			.expect(401)
			.end(function(subjectgroupSaveErr, subjectgroupSaveRes) {
				// Call the assertion callback
				done(subjectgroupSaveErr);
			});
	});

	it('should not be able to save Subjectgroup instance if no name is provided', function(done) {
		// Invalidate name field
		subjectgroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subjectgroup
				agent.post('/subjectgroups')
					.send(subjectgroup)
					.expect(400)
					.end(function(subjectgroupSaveErr, subjectgroupSaveRes) {
						// Set message assertion
						(subjectgroupSaveRes.body.message).should.match('Please fill Subjectgroup name');
						
						// Handle Subjectgroup save error
						done(subjectgroupSaveErr);
					});
			});
	});

	it('should be able to update Subjectgroup instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subjectgroup
				agent.post('/subjectgroups')
					.send(subjectgroup)
					.expect(200)
					.end(function(subjectgroupSaveErr, subjectgroupSaveRes) {
						// Handle Subjectgroup save error
						if (subjectgroupSaveErr) done(subjectgroupSaveErr);

						// Update Subjectgroup name
						subjectgroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Subjectgroup
						agent.put('/subjectgroups/' + subjectgroupSaveRes.body._id)
							.send(subjectgroup)
							.expect(200)
							.end(function(subjectgroupUpdateErr, subjectgroupUpdateRes) {
								// Handle Subjectgroup update error
								if (subjectgroupUpdateErr) done(subjectgroupUpdateErr);

								// Set assertions
								(subjectgroupUpdateRes.body._id).should.equal(subjectgroupSaveRes.body._id);
								(subjectgroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Subjectgroups if not signed in', function(done) {
		// Create new Subjectgroup model instance
		var subjectgroupObj = new Subjectgroup(subjectgroup);

		// Save the Subjectgroup
		subjectgroupObj.save(function() {
			// Request Subjectgroups
			request(app).get('/subjectgroups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Subjectgroup if not signed in', function(done) {
		// Create new Subjectgroup model instance
		var subjectgroupObj = new Subjectgroup(subjectgroup);

		// Save the Subjectgroup
		subjectgroupObj.save(function() {
			request(app).get('/subjectgroups/' + subjectgroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', subjectgroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Subjectgroup instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subjectgroup
				agent.post('/subjectgroups')
					.send(subjectgroup)
					.expect(200)
					.end(function(subjectgroupSaveErr, subjectgroupSaveRes) {
						// Handle Subjectgroup save error
						if (subjectgroupSaveErr) done(subjectgroupSaveErr);

						// Delete existing Subjectgroup
						agent.delete('/subjectgroups/' + subjectgroupSaveRes.body._id)
							.send(subjectgroup)
							.expect(200)
							.end(function(subjectgroupDeleteErr, subjectgroupDeleteRes) {
								// Handle Subjectgroup error error
								if (subjectgroupDeleteErr) done(subjectgroupDeleteErr);

								// Set assertions
								(subjectgroupDeleteRes.body._id).should.equal(subjectgroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Subjectgroup instance if not signed in', function(done) {
		// Set Subjectgroup user 
		subjectgroup.user = user;

		// Create new Subjectgroup model instance
		var subjectgroupObj = new Subjectgroup(subjectgroup);

		// Save the Subjectgroup
		subjectgroupObj.save(function() {
			// Try deleting Subjectgroup
			request(app).delete('/subjectgroups/' + subjectgroupObj._id)
			.expect(401)
			.end(function(subjectgroupDeleteErr, subjectgroupDeleteRes) {
				// Set message assertion
				(subjectgroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle Subjectgroup error error
				done(subjectgroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Subjectgroup.remove().exec();
		done();
	});
});