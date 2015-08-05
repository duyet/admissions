'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GroupItem = mongoose.model('GroupItem');

/**
 * Globals
 */
var user, groupItem;

/**
 * Unit tests
 */
describe('Group item Model Unit Tests:', function() {
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
			groupItem = new GroupItem({
				name: 'Group item Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return groupItem.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			groupItem.name = '';

			return groupItem.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		GroupItem.remove().exec();
		User.remove().exec();

		done();
	});
});