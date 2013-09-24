define(['app' , 'controllers/loginController'] , function (app) {
// define(['app'] , function (app) {
	'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
        // $routeProvider.when('', {templateUrl: 'partials/loginForm.html', controller: 'loginController'});
        $routeProvider.when('', {templateUrl: 'partials/loginForm.html', controller: require('controllers/loginController')});
        $routeProvider.otherwise({redirectTo: ''});
    }]);
});