'use strict';

(function() {
	// Sectoritems Controller Spec
	describe('Sectoritems Controller Tests', function() {
		// Initialize global variables
		var SectoritemsController,
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

			// Initialize the Sectoritems controller.
			SectoritemsController = $controller('SectoritemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sectoritem object fetched from XHR', inject(function(Sectoritems) {
			// Create sample Sectoritem using the Sectoritems service
			var sampleSectoritem = new Sectoritems({
				name: 'New Sectoritem'
			});

			// Create a sample Sectoritems array that includes the new Sectoritem
			var sampleSectoritems = [sampleSectoritem];

			// Set GET response
			$httpBackend.expectGET('sectoritems').respond(sampleSectoritems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sectoritems).toEqualData(sampleSectoritems);
		}));

		it('$scope.findOne() should create an array with one Sectoritem object fetched from XHR using a sectoritemId URL parameter', inject(function(Sectoritems) {
			// Define a sample Sectoritem object
			var sampleSectoritem = new Sectoritems({
				name: 'New Sectoritem'
			});

			// Set the URL parameter
			$stateParams.sectoritemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sectoritems\/([0-9a-fA-F]{24})$/).respond(sampleSectoritem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sectoritem).toEqualData(sampleSectoritem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sectoritems) {
			// Create a sample Sectoritem object
			var sampleSectoritemPostData = new Sectoritems({
				name: 'New Sectoritem'
			});

			// Create a sample Sectoritem response
			var sampleSectoritemResponse = new Sectoritems({
				_id: '525cf20451979dea2c000001',
				name: 'New Sectoritem'
			});

			// Fixture mock form input values
			scope.name = 'New Sectoritem';

			// Set POST response
			$httpBackend.expectPOST('sectoritems', sampleSectoritemPostData).respond(sampleSectoritemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sectoritem was created
			expect($location.path()).toBe('/sectoritems/' + sampleSectoritemResponse._id);
		}));

		it('$scope.update() should update a valid Sectoritem', inject(function(Sectoritems) {
			// Define a sample Sectoritem put data
			var sampleSectoritemPutData = new Sectoritems({
				_id: '525cf20451979dea2c000001',
				name: 'New Sectoritem'
			});

			// Mock Sectoritem in scope
			scope.sectoritem = sampleSectoritemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sectoritems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sectoritems/' + sampleSectoritemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sectoritemId and remove the Sectoritem from the scope', inject(function(Sectoritems) {
			// Create new Sectoritem object
			var sampleSectoritem = new Sectoritems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sectoritems array and include the Sectoritem
			scope.sectoritems = [sampleSectoritem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sectoritems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSectoritem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sectoritems.length).toBe(0);
		}));
	});
}());