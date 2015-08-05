'use strict';

// Configuring the Articles module
angular.module('group-items').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Group items', 'group-items', 'dropdown', '/group-items(/create)?');
		Menus.addSubMenuItem('topbar', 'group-items', 'List Group items', 'group-items');
		Menus.addSubMenuItem('topbar', 'group-items', 'New Group item', 'group-items/create');
	}
]);