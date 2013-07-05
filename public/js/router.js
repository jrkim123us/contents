define([
    'backbone'
], function(){
	var Router = Backbone.Router.extend({
		vent : _.extend({}, Backbone.Event),
		routes: {
			"index": "index",
			"login": "login"
		},
		index: function() {
			this.navigate('login', {trigger: true});
		},
		login: function() {
			require([
				'app/views/login/loginView'
			], function(LoginView){
				var loginView = new LoginView({
					vent: this.vent
				});
			});
		}

	});

	var App = {};
	var initialize = function() {
		App.router = new Router();
		App.vent = _.extend({}, Backbone.Event);

		Backbone.history.start();

		App.router.navigate('index', {trigger: true});
	};

	return {
		initialize : initialize
	};
});