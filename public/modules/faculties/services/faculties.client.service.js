'use strict';

//Faculties service used to communicate Faculties REST endpoints
angular.module('faculties').factory('Faculties', ['$resource',
	function($resource) {
		return $resource('faculties/:facultyId', { facultyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);