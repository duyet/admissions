'use strict';

//Setting up route
angular.module('group-items').config(['$stateProvider',
	function($stateProvider) {
		// Group items state routing
		$stateProvider.
		state('listGroupItems', {
			url: '/group-items',
			templateUrl: 'modules/group-items/views/list-group-items.client.view.html'
		}).
		state('createGroupItem', {
			url: '/group-items/create',
			templateUrl: 'modules/group-items/views/create-group-item.client.view.html'
		}).
		state('viewGroupItem', {
			url: '/group-items/:groupItemId',
			templateUrl: 'modules/group-items/views/view-group-item.client.view.html'
		}).
		state('editGroupItem', {
			url: '/group-items/:groupItemId/edit',
			templateUrl: 'modules/group-items/views/edit-group-item.client.view.html'
		});
	}
]);