'use strict';

//Statistics service used to communicate Statistics REST endpoints
angular.module('statistics').factory('Statistics', ['$resource',
	function($resource) {
		return $resource('statistics/:statisticId', { statisticId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);