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
			school.doing = 0;
			// $scope.school = Schools.get({ 
			// 	schoolId: $stateParams.schoolId
			// });
			document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-refresh'></span> Đang Tính";
			var data = {school: school.code}
			$http({method: 'POST', url: 'apis/matriculate', async:false,data:data})
			.success(function(data, status, headers, config) {		
					// $scope.alldesign = data.design;
					// $scope.allmeasures = data.measure;
					// $scope.allproduct = data.product;
					console.log(data);
					if(data.result){
						school.doing = 1;
						document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-ok'></span> Thành công";
					}else{
						window.alert(data.message);
						school.doing = 2;
						document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
					}
					
					// loading('hide');
			}).error(function(data, status, headers, config) {
				window.alert("Server has experienced a problem. please try again after some time!");
				//loading('hide');
				school.doing = 2;
				document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
				console.log(data);
			});
		};
	}
]);