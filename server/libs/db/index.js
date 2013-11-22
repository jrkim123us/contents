var debug = require('debug')('db'),
	mongoose = require('mongoose'),
	User = require('./user'),
	Menu = require('./menu'),
	Task = require('./task'),
	Org = require('./org'),
	connString = 'mongodb://localhost/cms';
	// connString = 'mongodb://' + process.env.MY_USER + ':' + process.env.MY_PWD + '@somehost.com:9999/DbName';

// This is not actually used in the boilerplate, but is an example of a MongoDB / mongoose setup
// debug('connecting to database...');
mongoose.connect(connString);

// Should you need to do something on open or close...
mongoose.connection.on('open', function () {
	debug('Mongo connected.');
	// 메뉴 데이터 초기화
	Menu.remove({}, function(err) {
		Menu.initialize(function() {
			debug('Menu collection initialized');
		});
	});

	var bProcessTask = false;
	if(bProcessTask) {
		// 사용자 데이터 초기화 (Full set)
		User.remove({}, function(err) {
			User.initialize(function() {
				debug('User collection initialized');
				// 변경건이 있으면 그때만 하는 걸로.
				Task.remove({}, function(err) {
					Task.initialize(function() {
						debug('Task collection initialized');
						// Task 안에 사용자 정보 추가
						Task.initializeUser(User, function(err){
							if(err) throw err;
						});
					});
				});

				Org.remove({}, function(err) {
					Org.initialize(function() {
						debug('Org collection initialized');
						Org.initializeUser(User);
					});
				});
			});
		});
	} else {
		// 사용자 데이터 초기화 (Task 제외)
		User.remove({}, function(err) {
			User.initialize(function() {
				debug('User collection initialized');
				// Task 안에 사용자 정보 추가
				Task.initializeUser(User, function(err){
					if(err) throw err;
				});

				Org.remove({}, function(err) {
					Org.initialize(function() {
						debug('Org collection initialized');
						Org.initializeUser(User);
					});
				});
			});
		});
	}
});

mongoose.connection.on('close', function () {
	debug('Mongo closed.');
});

module.exports = {
	User : User,
	Org  : Org,
	Menu : Menu,
	Task : Task
};
