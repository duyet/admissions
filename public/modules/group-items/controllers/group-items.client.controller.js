'use strict';

// Group items controller
angular.module('group-items').controller('GroupItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'GroupItems',
	function($scope, $stateParams, $location, Authentication, GroupItems) {
		$scope.authentication = Authentication;

		// Create new Group item
		$scope.create = function() {
			// Create new Group item object
			var groupItem = new GroupItems ({
				name: this.name
			});

			// Redirect after save
			groupItem.$save(function(response) {
				$location.path('group-items/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Group item
		$scope.remove = function(groupItem) {
			if ( groupItem ) { 
				groupItem.$remove();

				for (var i in $scope.groupItems) {
					if ($scope.groupItems [i] === groupItem) {
						$scope.groupItems.splice(i, 1);
					}
				}
			} else {
				$scope.groupItem.$remove(function() {
					$location.path('group-items');
				});
			}
		};

		// Update existing Group item
		$scope.update = function() {
			var groupItem = $scope.groupItem;

			groupItem.$update(function() {
				$location.path('group-items/' + groupItem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Group items
		$scope.find = function() {
			$scope.groupItems = GroupItems.query();
		};

		// Find existing Group item
		$scope.findOne = function() {
			$scope.groupItem = GroupItems.get({ 
				groupItemId: $stateParams.groupItemId
			});
		};
	}
]);