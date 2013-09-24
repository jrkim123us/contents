
require.config({
	baseUrl : 'js/',
	paths: {
		jquery   : '../libs/jquery/jquery.min',
		domReady : '../libs/requirejs/domReady',
		angular  : '../libs/angular/angular',
		'angular-resource': '../libs/angular/angular-resource'
	},
	shim: {
		jquery             : {exports : '$'},
		angular            : {exports : 'angular', deps : ['jquery']},
		'angular-resource' : {deps : ['angular']},
	}
});

require(['angular', 'routes/loginRoute', 'domReady'], function (angular, app, domReady) {
	'use strict';
	domReady(function() {
		angular.bootstrap(document, [app.name]);
	});
});