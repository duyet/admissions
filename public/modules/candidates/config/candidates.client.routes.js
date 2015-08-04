'use strict';

//Setting up route
angular.module('candidates').config(['$stateProvider',
	function($stateProvider) {
		// Candidates state routing
		$stateProvider.
		state('listCandidates', {
			url: '/candidates',
			templateUrl: 'modules/candidates/views/list-candidates.client.view.html'
		}).
		state('createCandidate', {
			url: '/candidates/create',
			templateUrl: 'modules/candidates/views/create-candidate.client.view.html'
		}).
		state('viewCandidate', {
			url: '/candidates/:candidateId',
			templateUrl: 'modules/candidates/views/view-candidate.client.view.html'
		}).
		state('editCandidate', {
			url: '/candidates/:candidateId/edit',
			templateUrl: 'modules/candidates/views/edit-candidate.client.view.html'
		});
	}
]);