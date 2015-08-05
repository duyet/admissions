'use strict';

//Setting up route
angular.module('subjectgroups').config(['$stateProvider',
	function($stateProvider) {
		// Subjectgroups state routing
		$stateProvider.
		state('listSubjectgroups', {
			url: '/subjectgroups',
			templateUrl: 'modules/subjectgroups/views/list-subjectgroups.client.view.html'
		}).
		state('createSubjectgroup', {
			url: '/subjectgroups/create',
			templateUrl: 'modules/subjectgroups/views/create-subjectgroup.client.view.html'
		}).
		state('viewSubjectgroup', {
			url: '/subjectgroups/:subjectgroupId',
			templateUrl: 'modules/subjectgroups/views/view-subjectgroup.client.view.html'
		}).
		state('editSubjectgroup', {
			url: '/subjectgroups/:subjectgroupId/edit',
			templateUrl: 'modules/subjectgroups/views/edit-subjectgroup.client.view.html'
		});
	}
]);