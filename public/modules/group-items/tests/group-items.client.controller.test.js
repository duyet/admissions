'use strict';

(function() {
	// Group items Controller Spec
	describe('Group items Controller Tests', function() {
		// Initialize global variables
		var GroupItemsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Group items controller.
			GroupItemsController = $controller('GroupItemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Group item object fetched from XHR', inject(function(GroupItems) {
			// Create sample Group item using the Group items service
			var sampleGroupItem = new GroupItems({
				name: 'New Group item'
			});

			// Create a sample Group items array that includes the new Group item
			var sampleGroupItems = [sampleGroupItem];

			// Set GET response
			$httpBackend.expectGET('group-items').respond(sampleGroupItems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.groupItems).toEqualData(sampleGroupItems);
		}));

		it('$scope.findOne() should create an array with one Group item object fetched from XHR using a groupItemId URL parameter', inject(function(GroupItems) {
			// Define a sample Group item object
			var sampleGroupItem = new GroupItems({
				name: 'New Group item'
			});

			// Set the URL parameter
			$stateParams.groupItemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/group-items\/([0-9a-fA-F]{24})$/).respond(sampleGroupItem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.groupItem).toEqualData(sampleGroupItem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(GroupItems) {
			// Create a sample Group item object
			var sampleGroupItemPostData = new GroupItems({
				name: 'New Group item'
			});

			// Create a sample Group item response
			var sampleGroupItemResponse = new GroupItems({
				_id: '525cf20451979dea2c000001',
				name: 'New Group item'
			});

			// Fixture mock form input values
			scope.name = 'New Group item';

			// Set POST response
			$httpBackend.expectPOST('group-items', sampleGroupItemPostData).respond(sampleGroupItemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Group item was created
			expect($location.path()).toBe('/group-items/' + sampleGroupItemResponse._id);
		}));

		it('$scope.update() should update a valid Group item', inject(function(GroupItems) {
			// Define a sample Group item put data
			var sampleGroupItemPutData = new GroupItems({
				_id: '525cf20451979dea2c000001',
				name: 'New Group item'
			});

			// Mock Group item in scope
			scope.groupItem = sampleGroupItemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/group-items\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/group-items/' + sampleGroupItemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid groupItemId and remove the Group item from the scope', inject(function(GroupItems) {
			// Create new Group item object
			var sampleGroupItem = new GroupItems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Group items array and include the Group item
			scope.groupItems = [sampleGroupItem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/group-items\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGroupItem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.groupItems.length).toBe(0);
		}));
	});
}());