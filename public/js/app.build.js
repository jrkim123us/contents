requirejs.config({
	baseUrl: '../',

	paths: {
		'jquery'            : 'libs/jquery/jquery.min',
		'jquery.validate'   : 'libs/jquery.validation/jquery.validate',
		'jquery.chosen'     : 'libs/jquery.chosen/js/chosen.jquery',
		'underscore'        : 'libs/underscore/underscore-min',
		'backbone'          : 'libs/backbone/backbone-min', //backbone.js 로 처리하면 비정상 동작함.
		'bootstrap'         : 'libs/bootstrap/dist/js/bootstrap',
		'handlebars'        : 'libs/handlebars/handlebars.runtime',
		'handlebars.tmpl'   : 'libs/handlebars/handlebars.tmpl.min',
		'handlebars.helper' : 'js/utils/handlebars.helper',
		app                 : 'js'
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