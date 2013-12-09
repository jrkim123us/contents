// First extend the express server's prototype
var debug = require('debug')('http'),
	config  = require('./libs/config'),
	server  = require('./libs/server')(config),
	db      = require('./libs/db'),
	handler = require('./libs/handlers')(config, db),
	io;

//Setup passport
require('./libs/passport')(config, handler);
// Setup routes
require('./libs/routers')(config, handler);

// All set, start listening!
server.http.listen(config.app.get('port'), function(){
    debug('Http server listening on port %d in %s mode', config.app.get('port'), config.app.get('env'));
});

server.https.listen(config.app.get('httpsPort'), function() {
    debug('Https server listening on port %d in %s mode', config.app.get('httpsPort'), config.app.get('env'));
});

server.socket.listen(config.app.get('io.port'), function(){
    debug('socket server listening on port %d in %s mode', config.app.get('io.port'), config.app.get('env'));
});
/*io = require('socket.io').listen(config.app.get('io.port'), { log: false }, function() {
	debug('socket.io listening');
});*/

require('./libs/sockets')(server.io); // Socket.IO를 HTTP서버에 연결
