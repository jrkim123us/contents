var debug = require('debug')('router'),
	impl = require('implementjs');

// Two dependencies, an Express HTTP server and a handler
module.exports = function (app, handler) {
	debug('setting up routes...');

	// Validate handler's interface
	impl.implements(handler, {
		renderIndex: impl.F,
		renderLogin: impl.F,
		renderHome: impl.F//,
		// checkLogin: impl.F
	});

	app.get('/', handler.renderIndex);
	app.get('/login', handler.renderLogin);
	app.get('/home', handler.renderHome);

	app.post('/login', handler.checkLogin);
};

/*
 * GET home page.
 */
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/