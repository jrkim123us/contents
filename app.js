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
server.https.listen(443, function() {
    debug('Https server listening on port %d in %s mode', 443, config.app.get('env'));
});
// debug("Express server listening on port %d in %s mode", server.address().port, process.env.NODE_ENV);

/*
var express = require('express'),
    routes = require('./routes'),
    login = require('./routes/login'),
    http = require('http'),
    mongoose = require('mongoose'),
    path = require('path');


var app = express();


app.configure(function() {
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
    app.use(express.session({secret: 'this is a secret'}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require('less-middleware')({ src: __dirname + '/public' }));
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}

});

mongoose.connect('mongodb://localhost/cms');

var UserSchema = new mongoose.Schema({
    name  : String,
    email : String,
    age   : Number
}),
Users = mongoose.model('Users', UserSchema);

// app.get('/', routes.index);

app.get('/login', login.index);
app.post('/login', login.post);
app.get('/home', routes.home);


// dummy database

var users = {
  tj: { name: 'tj' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash('foobar', function(err, salt, hash){
  if (err) throw err;
  // store the salt & hash in the "db"
  users.tj.salt = salt;
  users.tj.hash = hash;
});


// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  // query the db for the given username
  if (!user) return fn(new Error('cannot find user'));
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash(pass, user.salt, function(err, hash){
    if (err) return fn(err);
    if (hash == user.hash) return fn(null, user);
    fn(new Error('invalid password'));
  })
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', function(req, res){
  res.redirect('login');
});

app.get('/restricted', restrict, function(req, res){
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/login', function(req, res){
  res.render('login');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/