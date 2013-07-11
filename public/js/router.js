define([
    'backbone'
], function(){
	var Router = Backbone.Router.extend({
		vent : _.extend({}, Backbone.Event),
		routes: {
			"": "root",
			"home" : "home",
			"home/:query/p:page" : "home",
			"todo" : "todo"
		},
		initialize: function(options) {
			this.viewManager = options.viewManager;
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
		home: function(query, page) {
			require(['app/views/home/homeView'], _.bind(function(HomeView){
				var homeView = new HomeView({vent: this.vent});

				this.viewManager.showView(homeView);
			}, this));
		},
		todo: function() {
			require(['app/views/todo/todoView'],  _.bind(function(TodoView) {
				var todoView = new TodoView({vent: this.vent});

				this.viewManager.showView(todoView);
			}, this));
		}
	});

	var ViewManager = function() {
		this.showView = function(view){
			if(this.currentView) {
				this.currentView.close();
			}

			this.currentView = view;
			this.currentView.render();

			$("#master").html(this.currentView.el);
		};
	};

	var App = {};
	var initialize = function() {
		App.router = new Router({
			viewManager : new ViewManager()
		});

		Backbone.history.start();
	};

	return {
		initialize : initialize
	};
});