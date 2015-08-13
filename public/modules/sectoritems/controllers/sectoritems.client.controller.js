'use strict';

// Sectoritems controller
angular.module('sectoritems').controller('SectoritemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sectoritems',
	function($scope, $stateParams, $location, Authentication, Sectoritems) {
		$scope.authentication = Authentication;

		// Create new Sectoritem
		$scope.create = function() {
			// Create new Sectoritem object
			var sectoritem = new Sectoritems ({
				name: this.name
			});

			// Redirect after save
			sectoritem.$save(function(response) {
				$location.path('sectoritems/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sectoritem
		$scope.remove = function(sectoritem) {
			if ( sectoritem ) { 
				sectoritem.$remove();

				for (var i in $scope.sectoritems) {
					if ($scope.sectoritems [i] === sectoritem) {
						$scope.sectoritems.splice(i, 1);
					}
				}
			} else {
				$scope.sectoritem.$remove(function() {
					$location.path('sectoritems');
				});
			}
		};

		// Update existing Sectoritem
		$scope.update = function() {
			var sectoritem = $scope.sectoritem;

			sectoritem.$update(function() {
				$location.path('sectoritems/' + sectoritem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sectoritems
		$scope.find = function() {
			$scope.sectoritems = Sectoritems.query();
		};

		// Find existing Sectoritem
		$scope.findOne = function() {
			$scope.sectoritem = Sectoritems.get({ 
				sectoritemId: $stateParams.sectoritemId
			});
		};
	}
]);