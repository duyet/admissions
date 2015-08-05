'use strict';

// Subjectgroups controller
angular.module('subjectgroups').controller('SubjectgroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Subjectgroups',
	function($scope, $stateParams, $location, Authentication, Subjectgroups) {
		$scope.authentication = Authentication;

		// Create new Subjectgroup
		$scope.create = function() {
			// Create new Subjectgroup object
			var subjectgroup = new Subjectgroups ({
				name: this.name
			});

			// Redirect after save
			subjectgroup.$save(function(response) {
				$location.path('subjectgroups/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Subjectgroup
		$scope.remove = function(subjectgroup) {
			if ( subjectgroup ) { 
				subjectgroup.$remove();

				for (var i in $scope.subjectgroups) {
					if ($scope.subjectgroups [i] === subjectgroup) {
						$scope.subjectgroups.splice(i, 1);
					}
				}
			} else {
				$scope.subjectgroup.$remove(function() {
					$location.path('subjectgroups');
				});
			}
		};

		// Update existing Subjectgroup
		$scope.update = function() {
			var subjectgroup = $scope.subjectgroup;

			subjectgroup.$update(function() {
				$location.path('subjectgroups/' + subjectgroup._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Subjectgroups
		$scope.find = function() {
			$scope.subjectgroups = Subjectgroups.query();
		};

		// Find existing Subjectgroup
		$scope.findOne = function() {
			$scope.subjectgroup = Subjectgroups.get({ 
				subjectgroupId: $stateParams.subjectgroupId
			});
		};
	}
]);