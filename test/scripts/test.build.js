var tests = [];
for (var file in window.__karma__.files) {
	if (window.__karma__.files.hasOwnProperty(file)) {
	    if (/Spec\.js$/.test(file)) {
	        tests.push(file);
	    }
	}
}

require.config({
	baseUrl : "/base/app/js",
	paths: {
		jquery   : '../libs/jquery/jquery.min',
		domReady : '../libs/requirejs/domReady',

		angular            : '../libs/angular/angular',
		'angular-resource' : '../libs/angular/angular-resource',
		'angular-mocks'    : '../../test/libs/angular/angular-mocks',
		'unitTests'        : '../../test/unit'
	},
	shim: {
		jquery             : {exports : '$'},
		angular            : {exports : 'angular', deps : ['jquery']},
		'angular-resource' : {deps : ['angular']},
		'angular-mocks'    : {deps : ['angular-resource']}
	},
	priority : [
		'angular'
	],
	// ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});

/*require(['domReady'], function (domReady) {
	'use strict';
	domReady(function() {
		window.__karma__.start();
	});
});*/