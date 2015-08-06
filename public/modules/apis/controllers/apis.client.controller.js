'use strict';

// Apis controller
angular.module('apis').controller('ApisController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apis',
	function($scope, $stateParams, $location, Authentication, Apis) {
		$scope.authentication = Authentication;

		// Create new Api
		$scope.create = function() {
			// Create new Api object
			var api = new Apis ({
				name: this.name
			});

			// Redirect after save
			api.$save(function(response) {
				$location.path('apis/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Api
		$scope.remove = function(api) {
			if ( api ) { 
				api.$remove();

				for (var i in $scope.apis) {
					if ($scope.apis [i] === api) {
						$scope.apis.splice(i, 1);
					}
				}
			} else {
				$scope.api.$remove(function() {
					$location.path('apis');
				});
			}
		};

		// Update existing Api
		$scope.update = function() {
			var api = $scope.api;

			api.$update(function() {
				$location.path('apis/' + api._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Apis
		$scope.find = function() {
			$scope.apis = Apis.query();
		};

		// Find existing Api
		$scope.findOne = function() {
			$scope.api = Apis.get({ 
				apiId: $stateParams.apiId
			});
		};
	}
]);