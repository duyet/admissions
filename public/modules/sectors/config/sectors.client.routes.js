'use strict';

//Setting up route
angular.module('sectors').config(['$stateProvider',
	function($stateProvider) {
		// Sectors state routing
		$stateProvider.
		state('listSectors', {
			url: '/sectors',
			templateUrl: 'modules/sectors/views/list-sectors.client.view.html'
		}).
		state('createSector', {
			url: '/sectors/create',
			templateUrl: 'modules/sectors/views/create-sector.client.view.html'
		}).
		state('viewSector', {
			url: '/sectors/:sectorId',
			templateUrl: 'modules/sectors/views/view-sector.client.view.html'
		}).
		state('editSector', {
			url: '/sectors/:sectorId/edit',
			templateUrl: 'modules/sectors/views/edit-sector.client.view.html'
		});
	}
]);