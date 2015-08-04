'use strict';

//Candidates service used to communicate Candidates REST endpoints
angular.module('candidates').factory('Candidates', ['$resource',
	function($resource) {
		return $resource('candidates/:candidateId', { candidateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);