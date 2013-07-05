var debug = require('debug')('router'),
	impl = require('implementjs');

// Two dependencies, an Express HTTP server and a handler
module.exports = function (app, handler) {
	debug('setting up routes...');

	// Validate handler's interface
	impl.implements(handler, {
		renderIndex: impl.F
	});

	app.get('/', handler.renderIndex);
};

/*
 * GET home page.
 */
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/