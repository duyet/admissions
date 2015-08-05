'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Subjectgroup = mongoose.model('Subjectgroup');

/**
 * Globals
 */
var user, subjectgroup;

/**
 * Unit tests
 */
describe('Subjectgroup Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			subjectgroup = new Subjectgroup({
				name: 'Subjectgroup Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return subjectgroup.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			subjectgroup.name = '';

			return subjectgroup.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Subjectgroup.remove().exec();
		User.remove().exec();

		done();
	});
});