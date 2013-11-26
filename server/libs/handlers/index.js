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
						if(result[0]) {
							result[0].open = true;
							result[0].parent = undefined;
						}
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
			var statusCode = 200,
				task = req.body,
				parent = req.body.parent;

			db.Task.setTask(task)
				.then(function(updatedCnt) {
					return db.Task.setParentDate(parent, true, true);
				})
				.fail(function() {
					statusCode = 500;
				})
				.done(function(docs) {
					res.send(statusCode);
				});
		},
		dndTaskResize : function(req, res) {
			var statusCode = 200,
				task = req.body.task,
				parent = req.body.task.parent;
			db.Task.setTask(task)
				.then(function(updatedCnt) {
					return db.Task.setParentDate(parent, true, true);
				})
				.fail(function() {
					statusCode = 500;
				})
				.done(function(docs) {
					res.json(statusCode, docs);
				});
		},
		dndTaskRow: function(req, res) {
			var statusCode = 200, params = req.body;
			if(params.isChangeParent)
				// 부모가 변경 경우
				// 1. landing point 의 아래로 밀리는 항목 Shift (하위 레벨 변경도 포함)
				db.Task.shiftTasks(params.shift[1])
					// 2. 이동하는 Task의 parent, id 변경 (하위 레벨 변경도 포함)
					.then(function(docs) {
						// landing point
						return db.Task.setMovedTaskIndex(params.moved);
					})
					// 3, leaving point 의 위로 올라오는 항목 Shift (하위 레벨 변경도 포함)
					.then(function(docs) {
						return db.Task.shiftTasks(params.shift[0]);
					})
					// 4. leaving point 의 상위 부모 일정 조정
					.then(function(docs) {
						return db.Task.setParentDate(params.shift[0].parent.id, true, true);
					})
					// 5. landing point 의 상위 부모 일정 조정
					.then(function(docs) {
						return db.Task.setParentDate(params.shift[1].parent.id, true, true);
					})
					.fail(function(err) {
						statusCode = 500;
					})
					.done(function(docs) {
						res.send(statusCode);
					});
			else {
				// 동일 부모 이동시, index가 늘어나는 것이 아니므로,
				// 일단 이동되는 항목은 -1로 임시성으로 변환시킨 다음
				// shift 처리
				// 이후 -1 항목을 정상 처리한다.
				tempMoved = {
					id : params.moved.id,
					index : -1,
					parent : params.moved.parent
				};

				db.Task.setMovedTaskIndex(tempMoved)
					.then(function(docs) {
						return db.Task.shiftTasks(params.shift[0]);
					})
					.then(function(docs) {
						return db.Task.setMovedTaskIndex(params.moved);
					})
					.fail(function() {
						statusCode = 500;
					})
					.done(function(docs) {
						res.send(statusCode);
					});
			}

		},
		addTask: function(req, res) {
			var statusCode = 200, newTask = req.body;
			newTask.localIndex = newTask.index;
			// 1. Task 신규 등록
			db.Task.addTask(newTask)
				// 2. 부모 Task의 leaf 정보를 false로 변경
				.then(function(saved) {
					newTask = saved;
					return db.Task.checkTaskLeaf(newTask.parent);
				})
				// 3. 부모(상위 레벨들) Task의 일정 정보를 조정한다.
				.then(function() {
					return db.Task.setParentDate(newTask.parent, true, true);
				})
				.fail(function(err) {
					statusCode = 500;
				})
				.done(function(docs){
					res.json(statusCode, newTask);
				});
		},
		removeTask: function(req, res) {
			var statusCode = 200, parent = req.query.parent,
				wbsSplited = req.params.wbs.split('.'), errMsg;
			var params = {
					wbs    : req.params.wbs,
					id     : req.query.id
				},
				shift = {
					parent : {
						id  : req.query.parent,
						wbs : wbsSplited.slice(0 , wbsSplited.length - 1).join('.')
					},
					start : parseInt(req.query.index, 10) + 1,
					inc : -1
				};

			// 1. Task 삭제 (하위 항목 포함)
			db.Task.removeTask(params)
				// 2. 삭제된 항목 아래 Task shift up
				.then(function(docs) {
					return db.Task.shiftTasks(shift);
				})
				// 3. 부모의 하위 Task가 없는 경우 leaf를 true로 변경
				.then(function() {
					return db.Task.checkTaskLeaf(parent);
				})
				// 4. 부모(상위 레벨들) Task의 일정 정보를 조정한다.
				.then(function(leaf) {
					// parent Task 가 leaf 가 아닌 경우에만 부모 date를 재계산해야 함
					// leaf 인 경우에는 이미 parent date와 삭제 task의 date 정보가 동일함
					if(!leaf)
						return db.Task.setParentDate(parent, true, true);
				})
				.fail(function(err) {
					statusCode = 500;
					errMsg = err;
				})
				.done(function() {
					// res.send(statusCode);
					res.json(statusCode, errMsg);
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