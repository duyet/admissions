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
			loading_page.loading();
			if($scope.view_striped === school.code){
				$scope.view_striped = null;
			}else if($scope.view_striped != school.code && !school.faculty){
				var data = {school: school.code}
				$http({method: 'POST', url: 'apis/viewfaculty', async:false,data:data})
				.success(function(data, status, headers, config) {		
						//console.log(data);
						if(data.result){
							school.faculty = data.record;
							$scope.view_striped = school.code;
						}else{
							window.alert(data.message);
						}
						loading_page.hide();
				}).error(function(data, status, headers, config) {
					window.alert("Server has experienced a problem. please try again after some time!");
					//console.log(data);
					loading_page.hide();
				});
			}else{
				$scope.view_striped = school.code;
			}
			
			
		}	
	}
]);