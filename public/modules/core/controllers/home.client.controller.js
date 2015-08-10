'use strict';

angular.module('core').controller('HomeController', ['$scope', '$stateParams',
	'$location', '$http', 'Authentication', 'Subjectgroups', 'Subjects', 'Schools',
	function($scope, $stateParams, $location, $http, Authentication, Subjectgroups, 
		Subjects, Schools) {
		$scope.score = {};
		$scope.authentication = Authentication;
		$scope.subjectgroups = Subjectgroups.query(function (data) {
			$scope.subject_group = data[0];
		});
		$scope.subjects = Subjects.query();
		$scope.schools = Schools.query();
		
		$scope.query = function() {
			var data = {score: $scope.score, subjectgroup : $scope.subject_group}
			$http({method: 'POST', url: 'apis/query', async:false,data:data}).success(function(data, status, headers, config) {		
					console.log(data);
			}).error(function(data, status, headers, config) {
				window.alert("Server has experienced a problem. please try again after some time!");
				console.log(data);
			});
		};
		$scope.view_table = null;
		$scope.view_table_faculty = function (faculty) {
			if($scope.view_table == faculty){
				$scope.view_table = null;
			}else{
				$scope.view_table = faculty;
			}
			
		}
		$scope.view_school = function (school) {
			school.faculty = 'load';
			// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-refresh'></span> Đang Tính";
			var data = {school: school.code}
			$http({method: 'POST', url: 'apis/viewschool', async:false,data:data})
			.success(function(data, status, headers, config) {		
					// $scope.alldesign = data.design;
					// $scope.allmeasures = data.measure;
					// $scope.allproduct = data.product;
					console.log(data);
					if(data.result){
						school.faculty = data.record;
						// school.doing = 1;
						// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-ok'></span> Thành công";
					}else{
						window.alert(data.message);
						// school.doing = 2;
						// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
					}
					
					// loading('hide');
			}).error(function(data, status, headers, config) {
				window.alert("Server has experienced a problem. please try again after some time!");
				//loading('hide');
				// school.doing = 2;
				// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
				console.log(data);
			});
		}
	}
]);

// School controller
angular.module('core').controller('SchoolController', ['$scope', '$stateParams', 
	'$location', '$http', 'Authentication', 'Schools',
	function($scope, $stateParams, $location,$http, Authentication, Schools) {
		$scope.authentication = Authentication;

		// Find a list of Schools
		$scope.find = function() {
			$scope.schools = Schools.query();
		};
		$scope.view_faculty = function (school) {
			var data = {school: school.code}
			$http({method: 'POST', url: 'apis/viewfaculty', async:false,data:data})
			.success(function(data, status, headers, config) {		
					// $scope.alldesign = data.design;
					// $scope.allmeasures = data.measure;
					// $scope.allproduct = data.product;
					console.log(data);
					if(data.result){
						school.faculty = data.record;
						// school.doing = 1;
						// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-ok'></span> Thành công";
					}else{
						window.alert(data.message);
						// school.doing = 2;
						// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
					}
					
					// loading('hide');
			}).error(function(data, status, headers, config) {
				window.alert("Server has experienced a problem. please try again after some time!");
				//loading('hide');
				// school.doing = 2;
				// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
				console.log(data);
			});
			
		}
		$scope.findcandidates = function (school) {
			//var data = {school: school.code}data:data
			$http({method: 'GET', url: 'apis/findcandidates', async:false,})
			.success(function(data, status, headers, config) {		
					// $scope.alldesign = data.design;
					// $scope.allmeasures = data.measure;
					// $scope.allproduct = data.product;
					console.log(data);
					if(data.result){
						$scope.candidates = data.record;
						// school.doing = 1;
						// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-ok'></span> Thành công";
					}else{
						window.alert(data.message);
						// school.doing = 2;
						// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
					}
					
					// loading('hide');
			}).error(function(data, status, headers, config) {
				window.alert("Server has experienced a problem. please try again after some time!");
				//loading('hide');
				// school.doing = 2;
				// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
				console.log(data);
			});
			
		}
		
	}
]);