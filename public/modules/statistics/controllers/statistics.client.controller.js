'use strict';

// Statistics controller
angular.module('statistics').controller('StatisticsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Statistics',
	function($scope, $stateParams, $location, Authentication, Statistics) {
		$scope.authentication = Authentication;

		// Create new Statistic
		$scope.create = function() {
			// Create new Statistic object
			var statistic = new Statistics ({
				name: this.name
			});

			// Redirect after save
			statistic.$save(function(response) {
				$location.path('statistics/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Statistic
		$scope.remove = function(statistic) {
			if ( statistic ) { 
				statistic.$remove();

				for (var i in $scope.statistics) {
					if ($scope.statistics [i] === statistic) {
						$scope.statistics.splice(i, 1);
					}
				}
			} else {
				$scope.statistic.$remove(function() {
					$location.path('statistics');
				});
			}
		};

		// Update existing Statistic
		$scope.update = function() {
			var statistic = $scope.statistic;

			statistic.$update(function() {
				$location.path('statistics/' + statistic._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.statistics = [];
		// Find a list of Statistics
		$scope.find = function() {
			$scope.statistics = Statistics.query();
			console.log('statistics', $scope.statistics);
		};

		// Find existing Statistic
		$scope.findOne = function() {
			$scope.statistic = Statistics.get({ 
				statisticId: $stateParams.statisticId
			});
		};
	}
]);