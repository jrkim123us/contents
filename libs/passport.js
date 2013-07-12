var debug = require('debug')('passport'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function (config) {
	// Create the HTTP server
	debug('setting up passport...');
	var passport = config.passport;

	var users = [
		{ id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
		{ id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' },
		{ id: 3, username: 'kim', password: 'a', email: 'jrkim79@lgcns.com' }
	];

	function findById(id, fn) {
		var idx = id - 1;
		if (users[idx]) {
			fn(null, users[idx]);
		} else {
			fn(new Error('User ' + id + ' does not exist'));
		}
	}

	function findByUserMail(email, fn) {
		for (var i = 0, len = users.length; i < len; i++) {
			var user = users[i];
			if (user.email === email) {
				return fn(null, user);
			}
		}
		return fn(null, null);
	}

	// Passport session setup.
	//   To support persistent login sessions, Passport needs to be able to
	//   serialize users into and deserialize users out of the session.  Typically,
	//   this will be as simple as storing the user ID when serializing, and finding
	//   the user by ID when deserializing.
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		findById(id, function (err, user) {
			done(err, user);
		});
	});

	// Use the LocalStrategy within Passport.
	//   Strategies in passport require a `verify` function, which accept
	//   credentials (in this case, a username and password), and invoke a callback
	//   with a user object.  In the real world, this would query a database;
	//   however, in this example we are using a baked-in set of users.
	passport.use(
		new LocalStrategy(
			{usernameField : 'email'},
			function(email, password, done) {
				process.nextTick(function () {
					findByUserMail(email, function(err, user) {
						if (err) { return done(err); }
						if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
						if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }

						return done(null, user);
					});
				});
			}
		)
	);
};