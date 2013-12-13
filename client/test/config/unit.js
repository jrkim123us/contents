
module.exports = function (config) {
    config.set({
        frameworks : ['jasmine'],
        // base path, that will be used to resolve files and exclude
        basePath : '../..',
        files : [
            'bower_components/jquery/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'test/vendor/angular/angular-mocks.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls-0.6.0-SNAPSHOT.js',
            'src/**/*.js',
            'test/unit/**/*.spec.js',
            'dist/templates/**/*.js'
        ],
        reporters : 'progress',
        // web server port
        port : 8089,

        // cli runner port
        runnerPort : 9109,

        urlRoot : '/__test/',

        // enable / disable colors in the output (reporters and logs)
        colors : true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        // logLevel : LOG_DEBUG,
        logLevel : LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch : false,

        // polling interval in ms (ignored on OS that support inotify)
        autoWatchInterval : 0,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari
        // - PhantomJS
        browsers : ['Chrome'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun : true
    });
};