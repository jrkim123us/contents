requirejs.config({
	baseUrl: '../',
	paths: {
		jquery              : 'libs/jquery/jquery.min',
		'jquery.validate'   : 'libs/jquery/jquery.validate',
		underscore          : 'libs/underscore/underscore.min',
		backbone            : 'libs/backbone/backbone.min',
		bootstrap           : 'libs/bootstrap/js/bootstrap.min',
		handlebars          : 'libs/handlebars/handlebars.runtime',
		'handlebars.helper' : 'libs/handlebars/handlebars.helper',
		'handlebars.tmpl'   : 'libs/handlebars/handlebars.tmpl.min',
		app                 : 'js'
	},
	shim: {
		"backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"  //attaches "Backbone" to the window object
        },
        "underscore": {
            exports: "_" //attaches "_" to the window object
        },
        "bootstrap": {
			deps: ["jquery"]
        },
        "jquery.validate" : {
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