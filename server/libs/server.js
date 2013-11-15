var debug = require('debug')('server'),
	http = require('http'),
	https = require('https'),
	// httpProxy = require('http-proxy'),
	impl = require('implementjs');

module.exports = function (config) {
	// Create the HTTP server
	debug('creating Express server...');

	// var req = https.request(config.options, function(res) {
	// 	debug(res.statusCode);
	// 	res.on('data', function(d){
	// 		process.stdout.write(d);
	// 	});
	// });
	// var httpsServer = httpProxy.createServer(3000, 'localhost');

	var httpServer = http.createServer(config.app);
	var httpsServer = https.createServer(config.options, config.app);
	// Validate server's interface
	// impl.implements(server, {applyConfiguration: impl.F});

	// Apply the configuration
	// server.applyConfiguration();

	// Some initialization or whatever can go here...

	// Export the server
	return {
		http  : httpServer,
		https : httpsServer
	};
};