'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

var loading_button = {
	load_icon : '<span class="loader"><svg class="circular">'+
					    '<circle class="path" cx="16" cy="16" r="8" fill="none" stroke-width="2" stroke-miterlimit="10"/>'+
					  '</svg></span>',
	load_success : "<span class='glyphicon glyphicon-ok'></span>",
	load_error : "<span class='glyphicon glyphicon-remove'></span>",
	loading : function (button) {
		var button_html = document.getElementById(button);
		button_html.className = "btn btn-loading";
		button_html.innerHTML = this.load_icon;
	},
	success : function(button) {
		var button_html = document.getElementById(button);
		button_html.className = "btn btn-success"; 
		button_html.innerHTML = this.load_success;
	},
	error :function (button) {
		var button_html = document.getElementById(button);
		button_html.className = "btn btn-danger";
		button_html.innerHTML = this.load_error;
	},
}
var loading_page = {
	load_icon : '<div id="loader-page" class="loader-page"><svg class="circular">'+
					    '<circle class="path" cx="32" cy="32" r="16" fill="none" stroke-width="3" stroke-miterlimit="10"/>'+
					  '</svg></div>',
	init : function () {
		document.body.innerHTML = document.body.innerHTML + this.load_icon;
	},
	loading : function () {
		var button_html = document.getElementById('loader-page');
		button_html.className = "loader-page show";
	},
	hide : function() {
		var button_html = document.getElementById('loader-page');
		button_html.className = "loader-page hide";
	},
}
loading_page.init();