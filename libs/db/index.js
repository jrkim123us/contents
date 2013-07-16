var debug = require('debug')('db'),
	mongoose = require('mongoose'),
	User = require('./user'),
	Menu = require('./menu'),
	connString = 'mongodb://localhost/cms';
	// connString = 'mongodb://' + process.env.MY_USER + ':' + process.env.MY_PWD + '@somehost.com:9999/DbName';

// This is not actually used in the boilerplate, but is an example of a MongoDB / mongoose setup
// debug('connecting to database...');
mongoose.connect(connString);

// Should you need to do something on open or close...
mongoose.connection.on('open', function () {
	debug('Mongo connected.');

	Menu.remove({}, function(err) {
		debug('Menu collection droped');
		Menu.initialize();
	});
});

mongoose.connection.on('close', function () {
	debug('Mongo closed.');
});

module.exports = {
	User  : User,
	Menu : Menu
};
