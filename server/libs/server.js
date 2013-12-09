var debug = require('debug')('server'),
	http         = require('http'),
	https        = require('https'),

	// httpProxy = require('http-proxy'),
	impl         = require('implementjs');

module.exports = function (config) {
	// Create the HTTP server
	debug('creating Express server...');

	var httpServer = http.createServer(config.app);
	var httpsServer = https.createServer(config.options, config.app);
	var socketServer = http.createServer(config.app);
	var io = require('socket.io').listen(socketServer);
	// Validate server's interface
	// impl.implements(server, {applyConfiguration: impl.F});

	// Apply the configuration
	// server.applyConfiguration();

	// Some initialization or whatever can go here...

	// Export the server
	return {
		http  : httpServer,
		https : httpsServer,
		socket : socketServer,
		io : io
	};
};