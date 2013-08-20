requirejs.config({
	baseUrl: '../',
	map: {
		'*': {
			'css' : 'libs/requirejs/css'
		}
	},
	paths: {
		jquery              : 'libs/jquery/js/jquery.min',
		'jquery.validate'   : 'libs/jquery/js/jquery.validate',
		'jquery.chosen'     : 'libs/jquery/js/jquery.chosen',
		'jquery.css'        : 'libs/jquery/css',
		underscore          : 'libs/underscore/underscore.min',
		backbone            : 'libs/backbone/backbone.min', //backbone.js 로 처리하면 비정상 동작함.
		bootstrap           : 'libs/bootstrap/js/bootstrap',
		handlebars          : 'libs/handlebars/handlebars.runtime',
		'handlebars.helper' : 'libs/handlebars/handlebars.helper',
		'handlebars.tmpl'   : 'libs/handlebars/handlebars.tmpl.min',
		app                 : 'js',
		css                 : 'css'
	},
	shim: {
		"backbone": {
            deps: ["underscore"]//,
            // exports: "Backbone"  //attaches "Backbone" to the window object
        },
        "underscore": {
			deps: ["jquery"],
            exports: '_' //attaches "_" to the window object
        },
        "jquery": {
			exports: '$'
        },
        "bootstrap": {
			deps: ["jquery"]
        },
        "jquery.validate" : {
            deps: ["jquery"]
        },
        'jquery.chosen' : {
            deps: ["jquery"]
        },
        'handlebars.tmpl' : {
			deps    : ['handlebars.helper']
			// exports : 'handlebars'
        },
        'handlebars.helper' : {
			deps    : ['handlebars']
			// exports : 'handlebars'
        },
        "handlebars" : {
			exports: "Handlebars"
        }
	}
});

require([
	'app/app'
] , function(App) {
	App.initialize();
});