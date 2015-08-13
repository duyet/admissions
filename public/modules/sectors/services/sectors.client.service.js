'use strict';

//Sectors service used to communicate Sectors REST endpoints
angular.module('sectors').factory('Sectors', ['$resource',
	function($resource) {
		return $resource('sectors/:sectorId', { sectorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);