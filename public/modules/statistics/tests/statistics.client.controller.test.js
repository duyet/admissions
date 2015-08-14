'use strict';

(function() {
	// Statistics Controller Spec
	describe('Statistics Controller Tests', function() {
		// Initialize global variables
		var StatisticsController,
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

			// Initialize the Statistics controller.
			StatisticsController = $controller('StatisticsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Statistic object fetched from XHR', inject(function(Statistics) {
			// Create sample Statistic using the Statistics service
			var sampleStatistic = new Statistics({
				name: 'New Statistic'
			});

			// Create a sample Statistics array that includes the new Statistic
			var sampleStatistics = [sampleStatistic];

			// Set GET response
			$httpBackend.expectGET('statistics').respond(sampleStatistics);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.statistics).toEqualData(sampleStatistics);
		}));

		it('$scope.findOne() should create an array with one Statistic object fetched from XHR using a statisticId URL parameter', inject(function(Statistics) {
			// Define a sample Statistic object
			var sampleStatistic = new Statistics({
				name: 'New Statistic'
			});

			// Set the URL parameter
			$stateParams.statisticId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/statistics\/([0-9a-fA-F]{24})$/).respond(sampleStatistic);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.statistic).toEqualData(sampleStatistic);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Statistics) {
			// Create a sample Statistic object
			var sampleStatisticPostData = new Statistics({
				name: 'New Statistic'
			});

			// Create a sample Statistic response
			var sampleStatisticResponse = new Statistics({
				_id: '525cf20451979dea2c000001',
				name: 'New Statistic'
			});

			// Fixture mock form input values
			scope.name = 'New Statistic';

			// Set POST response
			$httpBackend.expectPOST('statistics', sampleStatisticPostData).respond(sampleStatisticResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Statistic was created
			expect($location.path()).toBe('/statistics/' + sampleStatisticResponse._id);
		}));

		it('$scope.update() should update a valid Statistic', inject(function(Statistics) {
			// Define a sample Statistic put data
			var sampleStatisticPutData = new Statistics({
				_id: '525cf20451979dea2c000001',
				name: 'New Statistic'
			});

			// Mock Statistic in scope
			scope.statistic = sampleStatisticPutData;

			// Set PUT response
			$httpBackend.expectPUT(/statistics\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/statistics/' + sampleStatisticPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid statisticId and remove the Statistic from the scope', inject(function(Statistics) {
			// Create new Statistic object
			var sampleStatistic = new Statistics({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Statistics array and include the Statistic
			scope.statistics = [sampleStatistic];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/statistics\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStatistic);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.statistics.length).toBe(0);
		}));
	});
}());