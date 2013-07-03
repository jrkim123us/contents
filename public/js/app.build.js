requirejs.config({
	baseUrl: '../',
	paths: {
		jquery     : 'libs/jquery/jquery.min',
		underscore : 'libs/underscore/underscore.min',
		backbone   : 'libs/backbone/backbone.min',
		bootstrap  : 'libs/bootstrap/js/bootstrap.min'
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
        }
	}
});