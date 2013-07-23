var debug = require('debug')('handler'),
	https = require('https');

// Usually expects "db" as an injected dependency to manipulate the models
module.exports = function (db) {
	debug('setting up handlers...');


	return {
		renderIndex: function (req, res) {
			res.render('index', {title: 'CMS', user: req.user});
		},
		renderLogin: function(req, res) {
			res.render('login', {title: 'CMS Sign in', user: req.user, message: req.flash('error')});
		},
		renderLogout: function(req, res) {
			req.logout();
			res.redirect('/');
		},
		redirectRoot : function(req, res) {
			// req.session.userId = '73007';
			res.redirect('/');
		},
		getMenus: function(req, res) {
			// db.Menu.getAll(function(arr, data){
			// 	res.send(data);
			// });
			db.Menu.getChildrenTree(function(arr, data){
				res.send(data);
			});

			// db.Menu.insert({name: 'Project', path: '/project'}, function() {
			// 	// debug('getMenu : %s', db.Menu.getAll());

			// });
		},
		getTasks: function(req, res) {
			res.send([
				{wbs: '1.3.4.1'},
				{wbs: '1.3.4.2'},
				{wbs: '1.3.4.3'},
				{wbs: '1.3.4.4'},
				{wbs: '1.3.4.5'}
			]);
		},
		getTabs: function(req, res) {
			db.Menu.getTabs(req.params.parentId, function(arr, data) {
				res.send(data);
			});
		},
		// Simple route middleware to ensure user is authenticated.
		//   Use this route middleware on any resource that needs to be protected.  If
		//   the request is authenticated (typically via a persistent login session),
		//   the request will proceed.  Otherwise, the user will be redirected to the
		//   login page.
		ensureAuthenticated: function(req, res, next) {
			if (req.isAuthenticated()) {
				return next();
			}
			res.redirect('/login');
		},
		getUserByEmail: function(email, callback) {
			db.User.getUserByEmail(email, callback);
		},
		getUserById: function(id, callback) {
			db.User.getUserById(id, callback);
		}
	};
};
