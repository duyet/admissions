'use strict';

//Group items service used to communicate Group items REST endpoints
angular.module('group-items').factory('GroupItems', ['$resource',
	function($resource) {
		return $resource('group-items/:groupItemId', { groupItemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);