'use strict';

angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$location', 'Authentication', 'Subjectgroups',
	function($scope, $stateParams, $location, Authentication, Subjectgroups) {
// angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	// function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.subjectgroups = Subjectgroups.query();
		// $scope.subjectgroups = [
		// 	{ subject_group: 'Toán-Lý-Hóa', block : 'A', subject1 : 'Toán', subject2 : 'Lý', subject3 : 'Hóa'},
		// 	{ subject_group: 'Toán-Lý-Anh', block : 'A1', subject1 : 'Toán', subject2 : 'Lý', subject3 : 'Anh'},
		// 	{ subject_group: 'Toán-Hóa-Sinh', block : 'B', subject1 : 'Toán', subject2 : 'Hóa', subject3 : 'Sinh'},
		// 	{ subject_group: 'Văn-Sử-Địa', block : 'C', subject1 : 'Văn', subject2 : 'Sử', subject3 : 'Địa'},
		// 	{ subject_group: 'Văn-Toán-Anh', block : 'D1', subject1 : 'Văn', subject2 : 'Toán', subject3 : 'Anh'},
		// 	{ subject_group: 'Văn-Toán-Nga', block : 'D2', subject1 : 'Văn', subject2 : 'Toán', subject3 : 'Nga'},
		// 	{ subject_group: 'Văn-Toán-Pháp', block : 'D3', subject1 : 'Văn', subject2 : 'Toán', subject3 : 'Pháp'},
		// 	{ subject_group: 'Văn-Toán-Trung', block : 'D4', subject1 : 'Văn', subject2 : 'Toán', subject3 : 'Trung'},
		// 	{ subject_group: 'Văn-Toán-Đức', block : 'D5', subject1 : 'Văn', subject2 : 'Toán', subject3 : 'Đức'},
		// 	{ subject_group: 'Văn-Toán-Nhật', block : 'D6', subject1 : 'Văn', subject2 : 'Toán', subject3 : 'Nhật'},
		// 	{ subject_group: 'Văn-Họa 1-Họa 2', block : 'H', subject1 : 'Văn', subject2 : 'Họa 1', subject3 : 'Họa 2'},
		// 	{ subject_group: 'Toán-Lý-Kĩ thuật', block : 'K', subject1 : 'Toán', subject2 : 'Lý', subject3 : 'Kĩ thuật'},
		// 	{ subject_group: 'Văn-Toán-Năng khiếu', block : 'M', subject1 : 'Văn', subject2 : 'Toán', subject3 : 'Năng khiếu mẫu giáo'},
		// 	{ subject_group: 'Văn-Năng khiếu', block : 'N', subject1 : 'Văn', subject2 : 'Năng khiếu nhạc 1', subject3 : 'Năng khiếu nhạc 2'},
		// 	{ subject_group: 'Văn-Lịch sử-Năng khiếu', block : 'R', subject1 : 'Văn', subject2 : 'Lịch sử', subject3 : 'Năng khiếu báo chí'},
		// 	{ subject_group: 'Sinh-Toán-Năng khiếu thể', block : 'T', subject1 : 'Sinh', subject2 : 'Toán', subject3 : 'Năng khiếu thể dục thể thao'},
		// 	{ subject_group: 'Toán-Lý-Vẽ', block : 'V', subject1 : 'Toán', subject2 : 'Lý', subject3 : 'Vẽ'},
		// 	{ subject_group: 'Văn-Năng khiếu', block : 'S', subject1 : 'Văn', subject2 : 'Năng khiếu Sân khấu 1', subject3 : 'Năng khiếu Sân khấu 2'}
		// ];
		$scope.subject_group = $scope.subjectgroups[0];
	}
]);