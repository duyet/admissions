'use strict';

// Faculties controller
angular.module('faculties').controller('FacultiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Faculties',
	function($scope, $stateParams, $location, Authentication, Faculties) {
		$scope.authentication = Authentication;

		// Create new Faculty
		$scope.create = function() {
			// Create new Faculty object
			var faculty = new Faculties ({
				name: this.name,
				code: this.code,
				group: this.group,
				quota: this.quota,
			});

			// Redirect after save
			faculty.$save(function(response) {
				$location.path('faculties/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Faculty
		$scope.remove = function(faculty) {
			if ( faculty ) { 
				faculty.$remove();

				for (var i in $scope.faculties) {
					if ($scope.faculties [i] === faculty) {
						$scope.faculties.splice(i, 1);
					}
				}
			} else {
				$scope.faculty.$remove(function() {
					$location.path('faculties');
				});
			}
		};

		// Update existing Faculty
		$scope.update = function() {
			var faculty = $scope.faculty;

			faculty.$update(function() {
				$location.path('faculties/' + faculty._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Faculties
		$scope.find = function() {
			$scope.faculties = Faculties.query();
		};

		// Find existing Faculty
		$scope.findOne = function() {
			$scope.faculty = Faculties.get({ 
				facultyId: $stateParams.facultyId
			});
		};
	}
]);