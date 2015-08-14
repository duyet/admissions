'use strict';

//Setting up route
angular.module('statistics').config(['$stateProvider',
	function($stateProvider) {
		// Statistics state routing
		$stateProvider.
		state('listStatistics', {
			url: '/statistics',
			templateUrl: 'modules/statistics/views/list-statistics.client.view.html'
		}).
		state('createStatistic', {
			url: '/statistics/create',
			templateUrl: 'modules/statistics/views/create-statistic.client.view.html'
		}).
		state('viewStatistic', {
			url: '/statistics/:statisticId',
			templateUrl: 'modules/statistics/views/view-statistic.client.view.html'
		}).
		state('editStatistic', {
			url: '/statistics/:statisticId/edit',
			templateUrl: 'modules/statistics/views/edit-statistic.client.view.html'
		});
	}
]);