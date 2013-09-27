'use strict';

define(['angular', 'appRoutes', 'services/dependencyResolverFor'], function (angular, config, dependencyResolverFor) {
    var app = angular.module('App', []);

    app.config([
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
            app.lazy = {
                controller : $controllerProvider.register,
                directive  : $compileProvider.directive,
                filter     : $filterProvider.register,
                factory    : $provide.factory,
                service    : $provide.service
            };

            $locationProvider.html5Mode(true);

            if(config.routes !== undefined) {
                angular.forEach(config.routes, function(route, path) {
                    $routeProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)});
                });
            }

            if(config.defaultRoutePaths !== undefined) {
                $routeProvider.otherwise({redirectTo:config.defaultRoutePaths});
            }
        }
    ]);

	return app;
});