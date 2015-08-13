'use strict';

// Sectors controller
angular.module('sectors').controller('SectorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sectors',
	function($scope, $stateParams, $location, Authentication, Sectors) {
		$scope.authentication = Authentication;

		// Create new Sector
		$scope.create = function() {
			// Create new Sector object
			var sector = new Sectors ({
				name: this.name
			});

			// Redirect after save
			sector.$save(function(response) {
				$location.path('sectors/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sector
		$scope.remove = function(sector) {
			if ( sector ) { 
				sector.$remove();

				for (var i in $scope.sectors) {
					if ($scope.sectors [i] === sector) {
						$scope.sectors.splice(i, 1);
					}
				}
			} else {
				$scope.sector.$remove(function() {
					$location.path('sectors');
				});
			}
		};

		// Update existing Sector
		$scope.update = function() {
			var sector = $scope.sector;

			sector.$update(function() {
				$location.path('sectors/' + sector._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sectors
		$scope.find = function() {
			$scope.sectors = Sectors.query();
		};

		// Find existing Sector
		$scope.findOne = function() {
			$scope.sector = Sectors.get({ 
				sectorId: $stateParams.sectorId
			});
		};
	}
]);