var debug = require('debug')('passport'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function (config, handler) {
	// Create the HTTP server
	debug('setting up passport...');
	var passport = config.passport;
	// Passport session setup.
	//   To support persistent login sessions, Passport needs to be able to
	//   serialize users into and deserialize users out of the session.  Typically,
	//   this will be as simple as storing the user ID when serializing, and finding
	//   the user by ID when deserializing.
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		handler.getUserById(id, function (err, user) {
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
					// findByUserMail(email, function(err, user) {
					handler.getUserByEmail(email, function(err, user) {
						if (err) { return done(err); }
						if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
						if (user.passwordHash != password) { return done(null, false, { message: 'Invalid password' }); }

						return done(null, user);
					});
				});
			}
		)
	);
};