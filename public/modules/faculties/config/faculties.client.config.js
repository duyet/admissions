'use strict';

// Configuring the Articles module
angular.module('faculties').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Faculties', 'faculties', 'dropdown', '/faculties(/create)?');
		Menus.addSubMenuItem('topbar', 'faculties', 'List Faculties', 'faculties');
		Menus.addSubMenuItem('topbar', 'faculties', 'New Faculty', 'faculties/create');
	}
]);