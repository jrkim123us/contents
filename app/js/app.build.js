
require.config({
	paths: {
		jquery  : '../libs/jquery/jquery.min',
		angular : '../libs/angular/angular',
		'angular-resource': '../libs/angular/angular-resource'
	},
	shim: {
		jquery             : {exports : '$'},
		angular            : {exports : 'angular', deps : ['jquery']},
		'angular-resource' : {deps : ['angular']},
	}
});

// require(['angular', 'app', 'services/services', 'controllers/loginControllers', 'directives/loginDirectives'], function (angular) {
require(['angular', 'routes/loginRoute'], function (angular, app) {
	'use strict';
	$(function() {
		angular.bootstrap(document, [app.name]);
	});
});