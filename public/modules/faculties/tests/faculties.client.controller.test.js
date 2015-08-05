'use strict';

(function() {
	// Faculties Controller Spec
	describe('Faculties Controller Tests', function() {
		// Initialize global variables
		var FacultiesController,
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

			// Initialize the Faculties controller.
			FacultiesController = $controller('FacultiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Faculty object fetched from XHR', inject(function(Faculties) {
			// Create sample Faculty using the Faculties service
			var sampleFaculty = new Faculties({
				name: 'New Faculty'
			});

			// Create a sample Faculties array that includes the new Faculty
			var sampleFaculties = [sampleFaculty];

			// Set GET response
			$httpBackend.expectGET('faculties').respond(sampleFaculties);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.faculties).toEqualData(sampleFaculties);
		}));

		it('$scope.findOne() should create an array with one Faculty object fetched from XHR using a facultyId URL parameter', inject(function(Faculties) {
			// Define a sample Faculty object
			var sampleFaculty = new Faculties({
				name: 'New Faculty'
			});

			// Set the URL parameter
			$stateParams.facultyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/faculties\/([0-9a-fA-F]{24})$/).respond(sampleFaculty);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.faculty).toEqualData(sampleFaculty);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Faculties) {
			// Create a sample Faculty object
			var sampleFacultyPostData = new Faculties({
				name: 'New Faculty'
			});

			// Create a sample Faculty response
			var sampleFacultyResponse = new Faculties({
				_id: '525cf20451979dea2c000001',
				name: 'New Faculty'
			});

			// Fixture mock form input values
			scope.name = 'New Faculty';

			// Set POST response
			$httpBackend.expectPOST('faculties', sampleFacultyPostData).respond(sampleFacultyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Faculty was created
			expect($location.path()).toBe('/faculties/' + sampleFacultyResponse._id);
		}));

		it('$scope.update() should update a valid Faculty', inject(function(Faculties) {
			// Define a sample Faculty put data
			var sampleFacultyPutData = new Faculties({
				_id: '525cf20451979dea2c000001',
				name: 'New Faculty'
			});

			// Mock Faculty in scope
			scope.faculty = sampleFacultyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/faculties\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/faculties/' + sampleFacultyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid facultyId and remove the Faculty from the scope', inject(function(Faculties) {
			// Create new Faculty object
			var sampleFaculty = new Faculties({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Faculties array and include the Faculty
			scope.faculties = [sampleFaculty];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/faculties\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFaculty);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.faculties.length).toBe(0);
		}));
	});
}());