define(['app' , 'controllers/LoginController'] , function (app) {
// define(['app'] , function (app) {
	'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
        // $routeProvider.when('', {templateUrl: 'partials/loginForm.html', controller: 'loginController'});
        $routeProvider.when('', {templateUrl: 'partials/loginForm.html', controller: require('controllers/LoginController')});
        $routeProvider.otherwise({redirectTo: ''});
    }]);
});