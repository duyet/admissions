'use strict';

(function() {
	// Candidates Controller Spec
	describe('Candidates Controller Tests', function() {
		// Initialize global variables
		var CandidatesController,
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

			// Initialize the Candidates controller.
			CandidatesController = $controller('CandidatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Candidate object fetched from XHR', inject(function(Candidates) {
			// Create sample Candidate using the Candidates service
			var sampleCandidate = new Candidates({
				name: 'New Candidate'
			});

			// Create a sample Candidates array that includes the new Candidate
			var sampleCandidates = [sampleCandidate];

			// Set GET response
			$httpBackend.expectGET('candidates').respond(sampleCandidates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.candidates).toEqualData(sampleCandidates);
		}));

		it('$scope.findOne() should create an array with one Candidate object fetched from XHR using a candidateId URL parameter', inject(function(Candidates) {
			// Define a sample Candidate object
			var sampleCandidate = new Candidates({
				name: 'New Candidate'
			});

			// Set the URL parameter
			$stateParams.candidateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/candidates\/([0-9a-fA-F]{24})$/).respond(sampleCandidate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.candidate).toEqualData(sampleCandidate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Candidates) {
			// Create a sample Candidate object
			var sampleCandidatePostData = new Candidates({
				name: 'New Candidate'
			});

			// Create a sample Candidate response
			var sampleCandidateResponse = new Candidates({
				_id: '525cf20451979dea2c000001',
				name: 'New Candidate'
			});

			// Fixture mock form input values
			scope.name = 'New Candidate';

			// Set POST response
			$httpBackend.expectPOST('candidates', sampleCandidatePostData).respond(sampleCandidateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Candidate was created
			expect($location.path()).toBe('/candidates/' + sampleCandidateResponse._id);
		}));

		it('$scope.update() should update a valid Candidate', inject(function(Candidates) {
			// Define a sample Candidate put data
			var sampleCandidatePutData = new Candidates({
				_id: '525cf20451979dea2c000001',
				name: 'New Candidate'
			});

			// Mock Candidate in scope
			scope.candidate = sampleCandidatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/candidates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/candidates/' + sampleCandidatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid candidateId and remove the Candidate from the scope', inject(function(Candidates) {
			// Create new Candidate object
			var sampleCandidate = new Candidates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Candidates array and include the Candidate
			scope.candidates = [sampleCandidate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/candidates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCandidate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.candidates.length).toBe(0);
		}));
	});
}());