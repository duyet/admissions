'use strict';

// Configuring the Articles module
angular.module('sectoritems').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sectoritems', 'sectoritems', 'dropdown', '/sectoritems(/create)?');
		Menus.addSubMenuItem('topbar', 'sectoritems', 'List Sectoritems', 'sectoritems');
		Menus.addSubMenuItem('topbar', 'sectoritems', 'New Sectoritem', 'sectoritems/create');
	}
]);