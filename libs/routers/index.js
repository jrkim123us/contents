var debug = require('debug')('router'),
	impl = require('implementjs');

// Two dependencies, an Express HTTP server and a handler
module.exports = function (app, handler) {
	debug('setting up routes...');

	// Validate handler's interface
	impl.implements(handler, {
		renderLogin         : impl.F,
		renderIndex         : impl.F,
		postLogin           : impl.F,
		checkAuthentication : impl.F
	});

	app.get('/login', handler.renderLogin);
	app.get('/', handler.checkAuthentication, handler.renderIndex);
	app.get('/index', handler.checkAuthentication, handler.renderIndex);

	app.post('/login', handler.postLogin);
};

/*
 * GET home page.
 */
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/