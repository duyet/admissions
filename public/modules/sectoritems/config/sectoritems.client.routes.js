'use strict';

//Setting up route
angular.module('sectoritems').config(['$stateProvider',
	function($stateProvider) {
		// Sectoritems state routing
		$stateProvider.
		state('listSectoritems', {
			url: '/sectoritems',
			templateUrl: 'modules/sectoritems/views/list-sectoritems.client.view.html'
		}).
		state('createSectoritem', {
			url: '/sectoritems/create',
			templateUrl: 'modules/sectoritems/views/create-sectoritem.client.view.html'
		}).
		state('viewSectoritem', {
			url: '/sectoritems/:sectoritemId',
			templateUrl: 'modules/sectoritems/views/view-sectoritem.client.view.html'
		}).
		state('editSectoritem', {
			url: '/sectoritems/:sectoritemId/edit',
			templateUrl: 'modules/sectoritems/views/edit-sectoritem.client.view.html'
		});
	}
]);