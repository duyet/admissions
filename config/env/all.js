'use strict';

module.exports = {
	app: {
		title: 'Admissions - Hệ thống truy vấn tuyển sinh',
		description: 'Admissions là hệ thống truy vấn tuyển sinh ĐH-CĐ 2015, '+
		'hỗ trợ tra cứu thông tin tuyển sinh, thông tin hồ sơ xét tuyển, tỉ lệ đậu rớt các trường ĐH-CĐ 2015. ',
		keywords: 'Admissions, Hệ thống truy vấn tuyển sinh, tra cứu, thông tin tuyển sinh, tỉ lệ đậu rớt, các trường ĐH-CĐ 2015'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
			//	'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/application.css',
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};