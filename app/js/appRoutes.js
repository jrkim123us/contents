'use strict';

define([], function() {
    return {
        defaultRoutePath: '/',
        routes: {
            '/': {
                templateUrl: 'partials/home.html',
                dependencies: [
                    'controllers/HomeController'
                ]
            },
            '/login': {
                templateUrl: 'partials/loginForm.html',
                dependencies: [
                    'controllers/LoginController'
                ]
            }
        }
    };
});