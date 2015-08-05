'use strict';

// Configuring the Articles module
angular.module('subjectgroups').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Subjectgroups', 'subjectgroups', 'dropdown', '/subjectgroups(/create)?');
		Menus.addSubMenuItem('topbar', 'subjectgroups', 'List Subjectgroups', 'subjectgroups');
		Menus.addSubMenuItem('topbar', 'subjectgroups', 'New Subjectgroup', 'subjectgroups/create');
	}
]);