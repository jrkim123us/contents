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

// Start Menu
		getMenus: function(req, res) {
			db.Menu.getChildrenTree(function(err, data){
				res.send(data);
			});
		},
		getTabs: function(req, res) {
			db.Menu.getTabs(req.params.parentId, function(err, data) {
				res.send(data);
			});
		},
// End Menu
// Task Start
		getTasksByParent: function(req, res) {
			db.Task.getTasksByParent(req.params.parentWbs, function(err, data) {
				if(err) throw err;
				res.send(data);
			});
		},
		getTask: function(req, res) {
			db.Task.getTask(req.params.wbs, function(err, data) {
				if(err) throw err;
				res.send(data);
			});
		},
		setTask: function(req, res) {
			db.Task.setTask(req.body, function(err, data) {
				if(err) throw err;

				/*if(!data) data = {};
				res.send({saved : data});
				debug('setTast : ' + data);*/
				res.end('{}');
			});
		},
// Task End


// Start Org
		getOrgs: function(req, res) {
			db.Org.getOrgs(function(err, data) {
				if(err) throw err;

				res.send(data);
			});
		},
// Start Org

		getUsers: function(req, res) {
			db.User.getAll(function(err, data) {
				if(err) throw err;

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
