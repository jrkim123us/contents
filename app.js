// First extend the express server's prototype
var debug = require('debug')('http'),
    config = require('./libs/config'),
    server = require('./libs/server')(config),
    db = require('./libs/db'),
    handler = require('./libs/handlers')(db);

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