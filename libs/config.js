var debug = require('debug')('config'),
	path = require('path'),
	fs = require('fs'),
    mongoose = require('mongoose'),
	express = require('express');

var app = express();

var options = {
	host : 'cms.lgcns.com',
	key  : fs.readFileSync(__dirname + '/privatekey.pem').toString(),
	cert : fs.readFileSync(__dirname + '/certificate.pem').toString()
};

app.configure(function() {
	var rootDir = path.resolve(__dirname, '..');
	// all environments
	app.set('port', process.env.PORT || 80);
	app.set('httpsPort', options.port || 443);
	app.set('views', rootDir + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
    app.use(express.session({secret: 'this is a secret'}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require('less-middleware')({ src: rootDir + '/public' }));
	app.use(express.static(path.join(rootDir, 'public')));

	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}

});

app.configure('dev', function () {
	debug('setting up "dev" configuration...');
	app.use(express.logger('tiny'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
	debug('setting up "production" configuration...');
	app.use(express.errorHandler());
});


module.exports = {
	app     : app,
	options : options
};