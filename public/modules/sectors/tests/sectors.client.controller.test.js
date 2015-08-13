'use strict';

(function() {
	// Sectors Controller Spec
	describe('Sectors Controller Tests', function() {
		// Initialize global variables
		var SectorsController,
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

			// Initialize the Sectors controller.
			SectorsController = $controller('SectorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sector object fetched from XHR', inject(function(Sectors) {
			// Create sample Sector using the Sectors service
			var sampleSector = new Sectors({
				name: 'New Sector'
			});

			// Create a sample Sectors array that includes the new Sector
			var sampleSectors = [sampleSector];

			// Set GET response
			$httpBackend.expectGET('sectors').respond(sampleSectors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sectors).toEqualData(sampleSectors);
		}));

		it('$scope.findOne() should create an array with one Sector object fetched from XHR using a sectorId URL parameter', inject(function(Sectors) {
			// Define a sample Sector object
			var sampleSector = new Sectors({
				name: 'New Sector'
			});

			// Set the URL parameter
			$stateParams.sectorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sectors\/([0-9a-fA-F]{24})$/).respond(sampleSector);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sector).toEqualData(sampleSector);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sectors) {
			// Create a sample Sector object
			var sampleSectorPostData = new Sectors({
				name: 'New Sector'
			});

			// Create a sample Sector response
			var sampleSectorResponse = new Sectors({
				_id: '525cf20451979dea2c000001',
				name: 'New Sector'
			});

			// Fixture mock form input values
			scope.name = 'New Sector';

			// Set POST response
			$httpBackend.expectPOST('sectors', sampleSectorPostData).respond(sampleSectorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sector was created
			expect($location.path()).toBe('/sectors/' + sampleSectorResponse._id);
		}));

		it('$scope.update() should update a valid Sector', inject(function(Sectors) {
			// Define a sample Sector put data
			var sampleSectorPutData = new Sectors({
				_id: '525cf20451979dea2c000001',
				name: 'New Sector'
			});

			// Mock Sector in scope
			scope.sector = sampleSectorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sectors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sectors/' + sampleSectorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sectorId and remove the Sector from the scope', inject(function(Sectors) {
			// Create new Sector object
			var sampleSector = new Sectors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sectors array and include the Sector
			scope.sectors = [sampleSector];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sectors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSector);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sectors.length).toBe(0);
		}));
	});
}());