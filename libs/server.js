var debug = require('debug')('server'),
	http = require('http'),
	impl = require('implementjs');

module.exports = function (app) {
	// Create the HTTP server
	debug('creating Express server...');
	var server = http.createServer(app);

	// Validate server's interface
	// impl.implements(server, {applyConfiguration: impl.F});

	// Apply the configuration
	// server.applyConfiguration();

	// Some initialization or whatever can go here...

	// Export the server
	return server;
};