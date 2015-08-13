'use strict';

//Sectoritems service used to communicate Sectoritems REST endpoints
angular.module('sectoritems').factory('Sectoritems', ['$resource',
	function($resource) {
		return $resource('sectoritems/:sectoritemId', { sectoritemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);