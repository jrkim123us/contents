	// base path, that will be used to resolve files and exclude
	basePath = '../..';

	// list of files / patterns to load in the browser
	files = [
		/*'test/vendor/angular/angular-scenario.js',*/
		/*'dist/angular.js',
		'dist/bootstrap.js',
		'dist/cms.js',*/
		ANGULAR_SCENARIO,
		ANGULAR_SCENARIO_ADAPTER,
		'test/e2e/**/*.js'
	];

	// use dots reporter, as travis terminal does not support escaping sequences
	// possible values: 'dots' || 'progress'
	reporters = 'progress';

	proxies = {
		'/' : 'http://localhost:80/'
	};

	// web server port
	// port = 8089;

	// cli runner port
	// runnerPort = 9109;

	urlRoot = '/__e2e/';
	// urlRoot = '/_karma_/';

	// enable / disable colors in the output (reporters and logs)
	colors = true;

	// level of logging
	// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
	// logLevel = LOG_DEBUG;
	logLevel = LOG_INFO;

	// enable / disable watching file and executing tests whenever any file changes
	autoWatch = true;

	// polling interval in ms (ignored on OS that support inotify)
	// autoWatchInterval = 0;

	// Start these browsers, currently available:
	// - Chrome
	// - ChromeCanary
	// - Firefox
	// - Opera
	// - Safari
	// - PhantomJS
	browsers = ['Chrome'];

	// Continuous Integration mode
	// if true, it capture browsers, run tests and exit
	singleRun = false;