var debug = require('debug')('router'),
	impl = require('implementjs');

// Two dependencies, an Express HTTP server and a handler
module.exports = function (config, handler) {
	debug('setting up routes...');
	var app = config.app;

	// Validate handler's interface
	impl.implements(handler, {
		renderLogin         : impl.F,
		renderLogout        : impl.F,
		renderIndex         : impl.F,
		redirectRoot        : impl.F,
		ensureAuthenticated : impl.F,

		getCurrentUser : impl.F,
		getGantt     : impl.F,
		getTask        : impl.F,

		getTasksByParent : impl.F,
		setTask          : impl.F,
		getMenus         : impl.F,
		getOrgs          : impl.F,
		getUsers         : impl.F,
		getTabs          : impl.F
	});
	// Note. Router 의 배치 순서 매우 중요함 !!
	// app.get('/login', handler.renderLogin);
	// app.get('/logout', handler.renderLogout);

	app.get('/', handler.renderIndex);
	app.get('/current-user', handler.getCurrentUser);
	app.post('/login', handler.getLogin);
	app.post('/logout', handler.getLogout);
	app.get('/menus', handler.ensureAuthenticated, handler.getMenus);

	/* 조직 */
	app.get('/orgs', handler.ensureAuthenticated, handler.getOrgs);

	/* TASK 및 Gantt 영역*/
	app.get('/gantt/:wbs', handler.ensureAuthenticated, handler.getGantt);
	app.post('/gantt/dnd', handler.ensureAuthenticated, handler.dndTask);
	app.get('/tasks/:wbs', handler.ensureAuthenticated, handler.getTask);
	app.post('/tasks/:wbs', handler.ensureAuthenticated, handler.setTask);
	app.put('/tasks/:wbs', handler.ensureAuthenticated, handler.addTask);
	app.delete('/tasks/:wbs', handler.ensureAuthenticated, handler.removeTask);

	app.get('/project/ptask/:wbs', handler.ensureAuthenticated, handler.getTask);
	app.get('/project/task/:parentWbs', handler.ensureAuthenticated, handler.getTasksByParent);
	app.post('/project/task', handler.ensureAuthenticated, handler.setTask);

	app.get('/common/menu', handler.ensureAuthenticated, handler.getMenus);
	app.get('/common/tab/:parentId', handler.ensureAuthenticated, handler.getTabs);
	app.get('/common/org', handler.ensureAuthenticated, handler.getOrgs);
	app.get('/common/user', handler.ensureAuthenticated, handler.getUsers);
	// 순서 중요 맨 마지막에 위치해야 함
	app.get('/*', handler.ensureAuthenticated, handler.renderIndex);
	// app.get('/', handler.ensureAuthenticated, handler.renderIndex);
	// app.get('/', handler.renderIndex);
	// app.get('/*', handler.ensureAuthenticated, handler.redirectRoot);
};
/*
 * GET home page.
 */
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/