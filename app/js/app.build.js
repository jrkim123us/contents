
require.config({
	baseUrl : 'js/',
	paths: {
		jquery   : '../libs/jquery/jquery.min',
		domReady : '../libs/requirejs/domReady',
		angular  : '../libs/angular/angular',
		app : 'app'
	},
	shim: {
		jquery  : {exports : '$'} ,
		angular : {exports : 'angular', deps : ['jquery']},
		'app'   : {exports : 'app', deps: ['angular']}
	}
});

/*require(['angular', 'routes/loginRoute', 'domReady'], function (angular, app, domReady) {
	'use strict';
	domReady(function() {
		angular.bootstrap(document, [app.name]);
	});
});*/
require(['app', 'domReady'], function (app, domReady) {
	'use strict';
	domReady(function() {
		angular.bootstrap(document, [app.name]);
	});
});
