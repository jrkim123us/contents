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

		getTasksByParent : impl.F,
		getTask          : impl.F,
		getMenus         : impl.F,
		getTabs          : impl.F
	});
	// Note. Router 의 배치 순서 매우 중요함 !!
	app.get('/login', handler.renderLogin);
	app.get('/logout', handler.renderLogout);

	app.post('/login',
		config.passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
		handler.redirectRoot
	);

	app.get('/project/task/:parentWbs', handler.ensureAuthenticated, handler.getTasksByParent);
	app.get('/project/ptask/:wbs', handler.ensureAuthenticated, handler.getTask);

	app.get('/common/menu', handler.ensureAuthenticated, handler.getMenus);
	app.get('/common/tab/:parentId', handler.ensureAuthenticated, handler.getTabs);
	// 순서 중요 맨 마지막에 위치해야 함
	// app.get('/*', handler.renderIndex);
	app.get('/', handler.ensureAuthenticated, handler.renderIndex);
	app.get('/*', handler.ensureAuthenticated, handler.redirectRoot);
};

/*
 * GET home page.
 */
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/