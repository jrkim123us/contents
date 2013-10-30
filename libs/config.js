// require('coffee-script');
var debug = require('debug')('config'),
	path = require('path'),
	fs = require('fs'),
	flash = require('connect-flash'),
	express = require('express'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var app = express();

var options = {
	host : 'cms.lgcns.com',
	key  : fs.readFileSync(__dirname + '/privatekey.pem').toString(),
	cert : fs.readFileSync(__dirname + '/certificate.pem').toString()
};

app.configure(function() {
	var rootDir = path.resolve(__dirname, '..');
	var distFolder = path.resolve(__dirname, '../client/dist'),staticUrl = '/static';

	// all environments
	app.set('port', process.env.PORT || 80);
	app.set('httpsPort', options.port || 443);

	/*app.set('port', process.env.PORT || 3000); // for Mac - 80 in use
	app.set('httpsPort', options.port || 3001);*/
	// app.set('views', rootDir + '/views');
	app.set('views', distFolder);
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: 'this is a secret'}));
	app.use(flash());
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(passport.session());
	// app.use(app.router); '/*'를 쓰기 위해서는 comment
	app.use(require('less-middleware')({ src: rootDir + '/app/css' }));
	// app.use(staticUrl, express.compress());
  	app.use(staticUrl, express.static(distFolder));
	// app.use(express.static(path.join(rootDir, 'app')));

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
	app      : app,
	passport : passport,
	options  : options
};