define([
    'backbone'
], function(){
	var Router = Backbone.Router.extend({
		vent : _.extend({}, Backbone.Event),
		routes: {
			""         : "root",
			"login"    : "getLogin",
			"home"     : "getHome",
			"todo"     : "getTodo",
			"planner"  : "getTodo",
			"bbs"      : "getTodo",
			"settings" : "getTodo",
			"*other"   : "defaultAction"
		},
		initialize: function(options) {
			this.contentViewManager = options.contentViewManager;
		},
		root: function() {
			if(window.location.pathname === '/login')
				this.getLogin();
			else
				this.index();
		},
		index: function() {
			this.navigate('/home', {trigger: true});
		},
		getLogin: function() {
			require([
				'app/views/login/loginView'
			], function(LoginView){
				var loginView = new LoginView({vent: this.vent});
			});
		},
		getMenu: function() {
			if(!this.menuView) {
				require(['app/views/common/menuView'], _.bind(function(MenuView){
					this.menuView = new MenuView({vent: this.vent});
					// this.menuView.render();

					$('#master-menu').html(this.menuView.el);
				}, this));
			}
		},
		getHome: function(query, page) {
			if(this.checkContentView())
				this.renderContentView(['app/views/home/homeView']);
		},
		getTodo: function() {
			if(this.checkContentView())
				this.renderContentView(['app/views/todo/todoView']);
		},
		checkContentView: function() {
			if(window.location.pathname === '/login')
				return false;

			this.getMenu();
			return true;
		},
		renderContentView: function(paths) {
			require(paths,  _.bind(function(View) {
				var view = new View({vent: this.vent});

				this.contentViewManager.showView(view);
			}, this));
		},
		defaultAction: function() {
			this.navigate('/home', {trigger: true});
		}
	});

	var ContentViewManager = function() {
		this.showView = function(view){
			if(this.currentView) {
				this.currentView.close();
			}

			this.currentView = view;
			this.currentView.render();

			$("#master-content").html(this.currentView.el);
		};
	};

	var App = {};
	var initialize = function() {
		App.router = new Router({
			contentViewManager : new ContentViewManager()
		});

		App.router.on('all', function() {
			if(window.location.pathname === '/login' && window.location.hash !== '') {
				window.location.hash = '';
				this.getLogin();
			}
		});

		// App.router.route( /^((?!login).)*$/, function() {
		// 	console.warn('called router on regEx!');
		// });

		Backbone.history.start();
		// Backbone.history.start({pushState: true});
	};


	return {
		initialize : initialize
	};
});