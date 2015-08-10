'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		})
		.state('school', {
			url: '/school',
			templateUrl: 'modules/core/views/school.client.view.html'
		})
		.state('candidate', {
			url: '/candidate',
			templateUrl: 'modules/core/views/candidate.client.view.html'
		});
	}
]);