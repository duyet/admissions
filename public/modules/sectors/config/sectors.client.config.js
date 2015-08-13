'use strict';

// Configuring the Articles module
angular.module('sectors').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sectors', 'sectors', 'dropdown', '/sectors(/create)?');
		Menus.addSubMenuItem('topbar', 'sectors', 'List Sectors', 'sectors');
		Menus.addSubMenuItem('topbar', 'sectors', 'New Sector', 'sectors/create');
	}
]);