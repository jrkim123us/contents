define([
    'backbone'
], function(){
	var Router = Backbone.Router.extend({
		vent : _.extend({}, Backbone.Event),
		routes: {
			"": "root",
			"home" : "home"
		},
		root: function() {
			if(window.location.pathname === '/login')
				this.login();
			else
				this.index();

		},
		login: function() {
			require([
				'app/views/login/loginView'
			], function(LoginView){
				var loginView = new LoginView({
					vent: this.vent
				});
			});
		},
		index: function() {
			this.navigate('/home', {trigger: true});
		},
		home: function(a, b) {
			require([
				'app/views/home/homeView'
			], function(HomeView){
				var homeView = new HomeView({
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
	};

	return {
		initialize : initialize
	};
});