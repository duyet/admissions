'use strict';

(function() {
	// Subjectgroups Controller Spec
	describe('Subjectgroups Controller Tests', function() {
		// Initialize global variables
		var SubjectgroupsController,
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

			// Initialize the Subjectgroups controller.
			SubjectgroupsController = $controller('SubjectgroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Subjectgroup object fetched from XHR', inject(function(Subjectgroups) {
			// Create sample Subjectgroup using the Subjectgroups service
			var sampleSubjectgroup = new Subjectgroups({
				name: 'New Subjectgroup'
			});

			// Create a sample Subjectgroups array that includes the new Subjectgroup
			var sampleSubjectgroups = [sampleSubjectgroup];

			// Set GET response
			$httpBackend.expectGET('subjectgroups').respond(sampleSubjectgroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.subjectgroups).toEqualData(sampleSubjectgroups);
		}));

		it('$scope.findOne() should create an array with one Subjectgroup object fetched from XHR using a subjectgroupId URL parameter', inject(function(Subjectgroups) {
			// Define a sample Subjectgroup object
			var sampleSubjectgroup = new Subjectgroups({
				name: 'New Subjectgroup'
			});

			// Set the URL parameter
			$stateParams.subjectgroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/subjectgroups\/([0-9a-fA-F]{24})$/).respond(sampleSubjectgroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.subjectgroup).toEqualData(sampleSubjectgroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Subjectgroups) {
			// Create a sample Subjectgroup object
			var sampleSubjectgroupPostData = new Subjectgroups({
				name: 'New Subjectgroup'
			});

			// Create a sample Subjectgroup response
			var sampleSubjectgroupResponse = new Subjectgroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Subjectgroup'
			});

			// Fixture mock form input values
			scope.name = 'New Subjectgroup';

			// Set POST response
			$httpBackend.expectPOST('subjectgroups', sampleSubjectgroupPostData).respond(sampleSubjectgroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Subjectgroup was created
			expect($location.path()).toBe('/subjectgroups/' + sampleSubjectgroupResponse._id);
		}));

		it('$scope.update() should update a valid Subjectgroup', inject(function(Subjectgroups) {
			// Define a sample Subjectgroup put data
			var sampleSubjectgroupPutData = new Subjectgroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Subjectgroup'
			});

			// Mock Subjectgroup in scope
			scope.subjectgroup = sampleSubjectgroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/subjectgroups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/subjectgroups/' + sampleSubjectgroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid subjectgroupId and remove the Subjectgroup from the scope', inject(function(Subjectgroups) {
			// Create new Subjectgroup object
			var sampleSubjectgroup = new Subjectgroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Subjectgroups array and include the Subjectgroup
			scope.subjectgroups = [sampleSubjectgroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/subjectgroups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSubjectgroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.subjectgroups.length).toBe(0);
		}));
	});
}());