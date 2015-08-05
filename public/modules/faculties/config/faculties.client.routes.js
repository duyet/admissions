'use strict';

//Setting up route
angular.module('faculties').config(['$stateProvider',
	function($stateProvider) {
		// Faculties state routing
		$stateProvider.
		state('listFaculties', {
			url: '/faculties',
			templateUrl: 'modules/faculties/views/list-faculties.client.view.html'
		}).
		state('createFaculty', {
			url: '/faculties/create',
			templateUrl: 'modules/faculties/views/create-faculty.client.view.html'
		}).
		state('viewFaculty', {
			url: '/faculties/:facultyId',
			templateUrl: 'modules/faculties/views/view-faculty.client.view.html'
		}).
		state('editFaculty', {
			url: '/faculties/:facultyId/edit',
			templateUrl: 'modules/faculties/views/edit-faculty.client.view.html'
		});
	}
]);