// School controller
angular.module('core').controller('SchoolController', ['$scope', '$stateParams', 
	'$location', '$http', 'Authentication', 'Schools','Subjectgroups','Faculties',
	function($scope, $stateParams, $location,$http, Authentication, Schools, 
		Subjectgroups, Faculties) {
		
		$scope.authentication = Authentication;

		// Find a list of Schools
		$scope.find = function() {
			$scope.schools = Schools.query();
		};
		$scope.view_striped = null;
		$scope.view_faculty = function (school) {
			//console.log(school.faculty);
			if($scope.view_striped === school.code){
				$scope.view_striped = null;
			}else if($scope.view_striped != school.code && !school.faculty){
				var data = {school: school.code}
				$http({method: 'POST', url: 'apis/viewfaculty', async:false,data:data})
				.success(function(data, status, headers, config) {		
						console.log(data);
						if(data.result){
							school.faculty = data.record;
							$scope.view_striped = school.code;
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
			}else{
				$scope.view_striped = school.code;
			}
			
			
		}
	// 	$scope.conditions = [];
	// 	$scope.addSchool = function (school) {	
	// 		$scope.pagination_active = 1;
	// 		$scope.pagination_count = 1;		
	// 		for(var x in $scope.conditions){
	// 			if($scope.conditions[x].type === 'school'){
	// 				$scope.conditions.splice(x, 1);
	// 			}
	// 		}
	// 		for(var x in $scope.conditions){
	// 			if($scope.conditions[x].type === 'faculty'){
	// 				$scope.conditions.splice(x, 1);
	// 			}
	// 		}
	// 		$scope.conditions.push({
	// 			type:'school',
	// 			name:school.name,
	// 			value:school.code
	// 		});
	// 		$scope.faculties = [];
	// 		var data = {school: school.code}
	// 		console.log(data);
	// 		$http({method: 'POST', url: 'apis/viewfaculty', async:false,data:data})
	// 		.success(function(data, status, headers, config) {		
	// 				// $scope.alldesign = data.design;
	// 				// $scope.allmeasures = data.measure;
	// 				// $scope.allproduct = data.product;
	// 				console.log(data);
	// 				if(data.result){
	// 					$scope.faculties = data.record;
	// 					$scope.view_striped = school.code;
	// 					$scope.findcandidates();
	// 					// school.doing = 1;
	// 					// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-ok'></span> Thành công";
	// 				}else{
	// 					window.alert(data.message);
	// 					// school.doing = 2;
	// 					// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
	// 				}
					
	// 				// loading('hide');
	// 		}).error(function(data, status, headers, config) {
	// 			window.alert("Server has experienced a problem. please try again after some time!");
	// 			//loading('hide');
	// 			// school.doing = 2;
	// 			// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
	// 			console.log(data);
	// 		});
	// 	}
	// 	$scope.addFaculty = function (faculty) {		
	// 		$scope.pagination_active = 1;
	// 		$scope.pagination_count = 1;	
	// 		for(var x in $scope.conditions){
	// 			if($scope.conditions[x].type === 'faculty'){
	// 				$scope.conditions.splice(x, 1);
	// 			}
	// 		}
	// 		$scope.conditions.push({
	// 			type:'faculty',
	// 			name:faculty.name,
	// 			value:faculty.code
	// 		});
	// 		$scope.findcandidates();
	// 	}
	// 	$scope.addPriority = function (Priority) {	
	// 		$scope.pagination_active = 1;
	// 		$scope.pagination_count = 1;		
	// 		for(var x in $scope.conditions){
	// 			if($scope.conditions[x].type === 'priority'){
	// 				$scope.conditions.splice(x, 1);
	// 			}
	// 		}
	// 		$scope.conditions.push({
	// 			type:'priority',
	// 			name:'Ưu tiên '+Priority,
	// 			value:Priority
	// 		});
	// 		$scope.findcandidates();
	// 	}
	// 	$scope.addSubjectgroup = function (subjectgroup) {	
	// 		$scope.pagination_active = 1;
	// 		$scope.pagination_count = 1;		
	// 		for(var x in $scope.conditions){
	// 			if($scope.conditions[x].type === 'subjectgroup'){
	// 				$scope.conditions.splice(x, 1);
	// 			}
	// 		}
	// 		$scope.conditions.push({
	// 			type:'subjectgroup',
	// 			name:subjectgroup.subject_group,
	// 			value:subjectgroup.subject_group
	// 		});
	// 		$scope.findcandidates();
	// 	}
	// 	$scope.addPagination = function (pagination) {			
	// 		$scope.pagination_active = pagination;
	// 		$scope.findcandidates();
	// 	}
	// 	$scope.removeCondition = function (condition) {	
	// 		$scope.pagination_active = 1;
	// 		$scope.pagination_count = 1;		
	// 		for(var x in $scope.conditions){
	// 			if($scope.conditions[x].type === condition.type){
	// 				$scope.conditions.splice(x, 1);
	// 			}
	// 		}
	// 		$scope.findcandidates();
	// 	}
	// 	$scope.search = function (condition) {	
	// 		$scope.pagination_active = 1;
	// 		$scope.pagination_count = 1;		
	// 		$scope.findcandidates();
	// 	}
	// 	$scope.schools = Schools.query();
	// 	$scope.faculties = [];
	// 	$scope.Subjectgroups = Subjectgroups.query();
	// 	$scope.query = null;
	// 	$scope.pagination = 0;
	// 	$scope.pagination_active = 1;
	// 	$scope.pagination_count = 1;
	// 	$scope.range = function(n) {
	//         return new Array(n);
	//     };
	// 	$scope.findcandidates = function () {
	// 		var data = {
	// 			conditions: $scope.conditions, 
	// 			pagination_active : $scope.pagination_active
	// 		};
	// 		if($scope.query != null && $scope.query.length > 0){
	// 			data = {
	// 				conditions: $scope.conditions, 
	// 				query : $scope.query, 
	// 				pagination_active : $scope.pagination_active
	// 			};
	// 		}
	// 		console.log(data);
	// 		$http({method: 'POST', url: 'apis/findcandidates', async:false,data:data})
	// 		.success(function(data, status, headers, config) {		
	// 				// $scope.alldesign = data.design;
	// 				// $scope.allmeasures = data.measure;
	// 				// $scope.allproduct = data.product;
	// 				console.log(data);
	// 				if(data.result){
	// 					$scope.candidates = data.record;
	// 					$scope.pagination = data.length;
	// 					$scope.pagination_active = data.pagination_active;
	// 					$scope.pagination_count = data.pagination_active > 1 ? ((data.pagination_active-1)*50) : 0;
	// 					// $scope.faculties = data.faculties;
	// 					// $scope.schools = data.schools;
	// 					// $scope.subjectgroups = data.subjectgroups;
	// 					// school.doing = 1;
	// 					// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-ok'></span> Thành công";
	// 				}else{
	// 					window.alert(data.message);
	// 					// school.doing = 2;
	// 					// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
	// 				}
					
	// 				// loading('hide');
	// 		}).error(function(data, status, headers, config) {
	// 			window.alert("Server has experienced a problem. please try again after some time!");
	// 			//loading('hide');
	// 			// school.doing = 2;
	// 			// document.getElementById("matriculate-"+school._id).innerHTML = "<span class='glyphicon glyphicon-remove'></span> Lỗi";
	// 			console.log(data);
	// 		});
			
	// 	}
		
	}
]);