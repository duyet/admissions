'use strict';

// Schools controller
angular.module('schools').controller('SchoolsController', ['$scope', '$stateParams', 
	'$location', '$http', 'Authentication', 'Schools',
	function($scope, $stateParams, $location,$http, Authentication, Schools) {
		$scope.authentication = Authentication;

		// Create new School
		$scope.create = function() {
			// Create new School object
			var school = new Schools ({
				name: this.name
			});

			// Redirect after save
			school.$save(function(response) {
				$location.path('schools/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing School
		$scope.remove = function(school) {
			if ( school ) { 
				school.$remove();

				for (var i in $scope.schools) {
					if ($scope.schools [i] === school) {
						$scope.schools.splice(i, 1);
					}
				}
			} else {
				$scope.school.$remove(function() {
					$location.path('schools');
				});
			}
		};

		// Update existing School
		$scope.update = function() {
			var school = $scope.school;

			school.$update(function() {
				$location.path('schools/' + school._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Schools
		$scope.find = function() {
			$scope.schools = Schools.query();
		};

		// Find existing School
		$scope.findOne = function() {
			$scope.school = Schools.get({ 
				schoolId: $stateParams.schoolId
			});
		};

		// matriculate
		$scope.matriculate = function(school) {
			loading_button.loading("matriculate-"+school._id);
			var data = {school: school.code}
			$http({method: 'POST', url: 'apis/matriculate', async:false,data:data})
			.success(function(data, status, headers, config) {			
					console.log(data);
					if(data.result){
						loading_button.success("matriculate-"+school._id);
					}else{
						window.alert(data.message);
						loading_button.error("matriculate-"+school._id);
					}					
					// loading('hide');
			}).error(function(data, status, headers, config) {
				window.alert("Server has experienced a problem. please try again after some time!");
				loading_button.error("matriculate-"+school._id);		
				console.log(data);
			});
		};
		// matriculate
		$scope.initialization = function(school) {
			loading_button.loading("initialization-"+school._id);
			var data = {school: school.code}
			$http({method: 'POST', url: 'apis/initialization', async:false,data:data})
			.success(function(data, status, headers, config) {		
					if(data.result){
						loading_button.success("initialization-"+school._id);
					}else{
						window.alert(data.message);
						loading_button.error("initialization-"+school._id);
					
					}
			}).error(function(data, status, headers, config) {
				window.alert("Server has experienced a problem. please try again after some time!");
				loading_button.error("initialization-"+school._id);
			});
		};
	}
]);