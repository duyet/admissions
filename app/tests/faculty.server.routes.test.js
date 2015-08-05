'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Faculty = mongoose.model('Faculty'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, faculty;

/**
 * Faculty routes tests
 */
describe('Faculty CRUD tests', function() {
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

		// Save a user to the test db and create new Faculty
		user.save(function() {
			faculty = {
				name: 'Faculty Name'
			};

			done();
		});
	});

	it('should be able to save Faculty instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Faculty
				agent.post('/faculties')
					.send(faculty)
					.expect(200)
					.end(function(facultySaveErr, facultySaveRes) {
						// Handle Faculty save error
						if (facultySaveErr) done(facultySaveErr);

						// Get a list of Faculties
						agent.get('/faculties')
							.end(function(facultiesGetErr, facultiesGetRes) {
								// Handle Faculty save error
								if (facultiesGetErr) done(facultiesGetErr);

								// Get Faculties list
								var faculties = facultiesGetRes.body;

								// Set assertions
								(faculties[0].user._id).should.equal(userId);
								(faculties[0].name).should.match('Faculty Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Faculty instance if not logged in', function(done) {
		agent.post('/faculties')
			.send(faculty)
			.expect(401)
			.end(function(facultySaveErr, facultySaveRes) {
				// Call the assertion callback
				done(facultySaveErr);
			});
	});

	it('should not be able to save Faculty instance if no name is provided', function(done) {
		// Invalidate name field
		faculty.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Faculty
				agent.post('/faculties')
					.send(faculty)
					.expect(400)
					.end(function(facultySaveErr, facultySaveRes) {
						// Set message assertion
						(facultySaveRes.body.message).should.match('Please fill Faculty name');
						
						// Handle Faculty save error
						done(facultySaveErr);
					});
			});
	});

	it('should be able to update Faculty instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Faculty
				agent.post('/faculties')
					.send(faculty)
					.expect(200)
					.end(function(facultySaveErr, facultySaveRes) {
						// Handle Faculty save error
						if (facultySaveErr) done(facultySaveErr);

						// Update Faculty name
						faculty.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Faculty
						agent.put('/faculties/' + facultySaveRes.body._id)
							.send(faculty)
							.expect(200)
							.end(function(facultyUpdateErr, facultyUpdateRes) {
								// Handle Faculty update error
								if (facultyUpdateErr) done(facultyUpdateErr);

								// Set assertions
								(facultyUpdateRes.body._id).should.equal(facultySaveRes.body._id);
								(facultyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Faculties if not signed in', function(done) {
		// Create new Faculty model instance
		var facultyObj = new Faculty(faculty);

		// Save the Faculty
		facultyObj.save(function() {
			// Request Faculties
			request(app).get('/faculties')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Faculty if not signed in', function(done) {
		// Create new Faculty model instance
		var facultyObj = new Faculty(faculty);

		// Save the Faculty
		facultyObj.save(function() {
			request(app).get('/faculties/' + facultyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', faculty.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Faculty instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Faculty
				agent.post('/faculties')
					.send(faculty)
					.expect(200)
					.end(function(facultySaveErr, facultySaveRes) {
						// Handle Faculty save error
						if (facultySaveErr) done(facultySaveErr);

						// Delete existing Faculty
						agent.delete('/faculties/' + facultySaveRes.body._id)
							.send(faculty)
							.expect(200)
							.end(function(facultyDeleteErr, facultyDeleteRes) {
								// Handle Faculty error error
								if (facultyDeleteErr) done(facultyDeleteErr);

								// Set assertions
								(facultyDeleteRes.body._id).should.equal(facultySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Faculty instance if not signed in', function(done) {
		// Set Faculty user 
		faculty.user = user;

		// Create new Faculty model instance
		var facultyObj = new Faculty(faculty);

		// Save the Faculty
		facultyObj.save(function() {
			// Try deleting Faculty
			request(app).delete('/faculties/' + facultyObj._id)
			.expect(401)
			.end(function(facultyDeleteErr, facultyDeleteRes) {
				// Set message assertion
				(facultyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Faculty error error
				done(facultyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Faculty.remove().exec();
		done();
	});
});