'use strict';

angular.module('core').controller('HomeController', ['$scope', '$stateParams',
	'$location', '$http', 'Authentication', 'Subjectgroups', 'Subjects', 'Apis',
	function($scope, $stateParams, $location, $http, Authentication, Subjectgroups, Subjects) {
		$scope.score = {};
		$scope.authentication = Authentication;
		$scope.subjectgroups = Subjectgroups.query(function (data) {
			$scope.subject_group = data[0];
		});
		$scope.subjects = Subjects.query();

		$scope.query = function() {
			var data = {score: $scope.score, subjectgroup : $scope.subject_group}
			$http({method: 'POST', url: 'apis/query', async:false,data:data}).success(function(data, status, headers, config) {		
					// $scope.alldesign = data.design;
					// $scope.allmeasures = data.measure;
					// $scope.allproduct = data.product;
					console.log(data);
					// loading('hide');
			}).error(function(data, status, headers, config) {
				window.alert("Server has experienced a problem. please try again after some time!");
				//loading('hide');
				console.log(data);
			});
		};
	}
]);