var debug = require('debug')('handler'),
	https = require('https'),
	async = require('async'),
	Q = require("q");


// Usually expects "db" as an injected dependency to manipulate the models
module.exports = function (config, db) {
	debug('setting up handlers...');

	function filterUser(user) {
		var filteredUser = {user : null};
		if(user)
			filteredUser.user = {
				firstName : user.name.first,
				lastName : user.name.last
			};
		return filteredUser;
	}

	function dbDeferred(query) {
		var deferred = Q.defer();
		query.exec(simpleCallback(deferred));
		return deferred.promise;
	}


	return {
		getLogin: function(req, res) {
			/*res.send({
				user: {
					firstName : 'jong rok',
					lastName  : 'kim'
				}
			});*/
			config.passport.authenticate('local', function(err, user) {
				if (err) { return next(err); }
				if(!user) {return res.json({user:null})}
				res.json(filterUser(user))

				req.logIn(user, function(err) {
					if ( err ) { return next(err); }
					return res.json(filterUser(user));
				});
			})(req,res);
		},
		getCurrentUser: function(req, res) {
			res.json(200, filterUser(req.user));
		},
		getLogout: function(req, res) {
			req.logout();
			res.send(204);
		},
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
		getGantt: function(req, res) {
			var wbs = req.params.wbs || '1';
			async.parallel({
				task: function(callback) {
					return db.Task.getTask(wbs, function(err, result) {
						return callback(err, result);
					});
				},
				data: function(callback) {
					db.Task.getGantt(wbs, function(err, result){
						// 중간 레벨 조회 시 parent 정보가 없어야 정상 조회됨
						result[0].parent = undefined;
						return callback(err, result);
					});
				},
				users: function(callback) {
					db.User.getAll(function(err, result) {
						return callback(err, result);
					});
				}
			}, function(err, data) {
				return res.send(data);
			});
		},
		getTask: function(req, res) {
			var wbs = req.params.wbs || '1';
			var data = {};

			async.parallel({
				task: function(callback) {
					return db.Task.getTask(wbs, function(err, result) {
						return callback(err, result);
					});
				},
				childs: function(callback) {
					return db.Task.getTasksByParent(wbs, function(err, result) {
						return callback(err, result);
					});
				}
			}, function(err, data) {
				return res.send(data);
			});
		},
		setTask: function(req, res) {
			db.Task.setTask(req.body, function(err, data) {
				var statusCode = 200;
				if(err) throw err;
				if(parseInt(data, 10) === 0) statusCode = 204;
				res.send(statusCode);
			});
		},
		dndTask: function(req, res) {
			// task_id 영역
			// wbs 영역
			var statusCode = 200;
			var wbs    = req.body.wbs;
			var taskId = req.body.taskId;
			var newPosTaskId = null;
			// Task_id
			// 1. 이동 시작/끝 Point Task
			// 2. 시작 ~ 끝 Task Task_id 수정
			// 3. 이동 대상 Task Task_id 수정
			// Wbs
			// 1. 전달 기준 하위 방향으로 wbs 수정
			// 2. 이동 대상 부모 wbs 수정
			// 시작 ~ 종료 일자
			async.waterfall([
				function(callback) {
					db.Task.getStartToEndTasks(taskId)
						.done(function(docs) {
							callback(null, docs);
						});
				},
				function(tasks, callback) {
					debug('getStartToEndTasks results : ' + tasks.toString());
					var inc = taskId.isDownward ? -1 : 1;
					db.Task.shiftTasks(tasks, inc)
						.done(function(dosc) {
							callback(null, dosc);
						});
				}
			], function(err, results) {
				if(err) {
					res.send(505);
				}
				res.json(results);
			});

			/*db.Task.getStartToEndTasks(taskId)
				.then(function(tasks) {
					debug('getStartToEndTasks results : ' + tasks.toString());
					var inc = taskId.isDownward ? -1 : 1;
					db.Task.shiftTasks(parseInt(tasks[0].taskId, 10), parseInt(tasks[1].taskId, 10));
				})
				.then(function(tasks) {
					debug('shiftTasks results : ' + tasks.toString());
					db.Task.resetWbs(wbs.dragEnd.parent.wbs, wbs.dragEnd.childrenIds);
				})
				.then(function (result) {
					res.json(result);
				})
				.fail(function (error) {
					res.send(500, error);
				})
				.done();*/
			/*db.Task.resetWbs(wbs.dragEnd.parent.wbs, wbs.dragEnd.childrenIds, function(endErr, endResult) {
				if(endErr) throw endErr;
				if(wbs.isChangeParent)
					db.Task.resetWbs(wbs.dragStart.parent.wbs, wbs.dragStart.childrenIds, function(startErr, startResult) {
						if(startErr) throw startErr;
						res.send(statusCode);
					});
				else
					res.send(statusCode);
			});*/
			// resetWbs = function (parentId, childrenIds, callback) {
		},
		addTask: function(req, res) {
			db.Task.addTask(req.body, function(startErr, saved) {
				if(err) throw err;
				res.json(200, saved);
			});
		},
		removeTask: function(req, res) {
			db.Task.removeTask(req.params.wbs, function(err, data) {
				res.send(200);
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
			// res.redirect('/login');
			res.redirect('/');
		},
		getUserByEmail: function(email, callback) {
			db.User.getUserByEmail(email, callback);
		},
		getUserById: function(id, callback) {
			db.User.getUserById(id, callback);
		}
	};
};