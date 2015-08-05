'use strict';

//Subjectgroups service used to communicate Subjectgroups REST endpoints
angular.module('subjectgroups').factory('Subjectgroups', ['$resource',
	function($resource) {
		return $resource('subjectgroups/:subjectgroupId', { subjectgroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);