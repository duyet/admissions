'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GroupItem = mongoose.model('GroupItem'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, groupItem;

/**
 * Group item routes tests
 */
describe('Group item CRUD tests', function() {
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

		// Save a user to the test db and create new Group item
		user.save(function() {
			groupItem = {
				name: 'Group item Name'
			};

			done();
		});
	});

	it('should be able to save Group item instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Group item
				agent.post('/group-items')
					.send(groupItem)
					.expect(200)
					.end(function(groupItemSaveErr, groupItemSaveRes) {
						// Handle Group item save error
						if (groupItemSaveErr) done(groupItemSaveErr);

						// Get a list of Group items
						agent.get('/group-items')
							.end(function(groupItemsGetErr, groupItemsGetRes) {
								// Handle Group item save error
								if (groupItemsGetErr) done(groupItemsGetErr);

								// Get Group items list
								var groupItems = groupItemsGetRes.body;

								// Set assertions
								(groupItems[0].user._id).should.equal(userId);
								(groupItems[0].name).should.match('Group item Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Group item instance if not logged in', function(done) {
		agent.post('/group-items')
			.send(groupItem)
			.expect(401)
			.end(function(groupItemSaveErr, groupItemSaveRes) {
				// Call the assertion callback
				done(groupItemSaveErr);
			});
	});

	it('should not be able to save Group item instance if no name is provided', function(done) {
		// Invalidate name field
		groupItem.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Group item
				agent.post('/group-items')
					.send(groupItem)
					.expect(400)
					.end(function(groupItemSaveErr, groupItemSaveRes) {
						// Set message assertion
						(groupItemSaveRes.body.message).should.match('Please fill Group item name');
						
						// Handle Group item save error
						done(groupItemSaveErr);
					});
			});
	});

	it('should be able to update Group item instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Group item
				agent.post('/group-items')
					.send(groupItem)
					.expect(200)
					.end(function(groupItemSaveErr, groupItemSaveRes) {
						// Handle Group item save error
						if (groupItemSaveErr) done(groupItemSaveErr);

						// Update Group item name
						groupItem.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Group item
						agent.put('/group-items/' + groupItemSaveRes.body._id)
							.send(groupItem)
							.expect(200)
							.end(function(groupItemUpdateErr, groupItemUpdateRes) {
								// Handle Group item update error
								if (groupItemUpdateErr) done(groupItemUpdateErr);

								// Set assertions
								(groupItemUpdateRes.body._id).should.equal(groupItemSaveRes.body._id);
								(groupItemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Group items if not signed in', function(done) {
		// Create new Group item model instance
		var groupItemObj = new GroupItem(groupItem);

		// Save the Group item
		groupItemObj.save(function() {
			// Request Group items
			request(app).get('/group-items')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Group item if not signed in', function(done) {
		// Create new Group item model instance
		var groupItemObj = new GroupItem(groupItem);

		// Save the Group item
		groupItemObj.save(function() {
			request(app).get('/group-items/' + groupItemObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', groupItem.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Group item instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Group item
				agent.post('/group-items')
					.send(groupItem)
					.expect(200)
					.end(function(groupItemSaveErr, groupItemSaveRes) {
						// Handle Group item save error
						if (groupItemSaveErr) done(groupItemSaveErr);

						// Delete existing Group item
						agent.delete('/group-items/' + groupItemSaveRes.body._id)
							.send(groupItem)
							.expect(200)
							.end(function(groupItemDeleteErr, groupItemDeleteRes) {
								// Handle Group item error error
								if (groupItemDeleteErr) done(groupItemDeleteErr);

								// Set assertions
								(groupItemDeleteRes.body._id).should.equal(groupItemSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Group item instance if not signed in', function(done) {
		// Set Group item user 
		groupItem.user = user;

		// Create new Group item model instance
		var groupItemObj = new GroupItem(groupItem);

		// Save the Group item
		groupItemObj.save(function() {
			// Try deleting Group item
			request(app).delete('/group-items/' + groupItemObj._id)
			.expect(401)
			.end(function(groupItemDeleteErr, groupItemDeleteRes) {
				// Set message assertion
				(groupItemDeleteRes.body.message).should.match('User is not logged in');

				// Handle Group item error error
				done(groupItemDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GroupItem.remove().exec();
		done();
	});
});