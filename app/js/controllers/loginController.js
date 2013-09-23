'use strict';

/* Controllers */
define(['angular', 'app'], function(angular, app) {
	app.controller('loginController', ['$scope', function ($scope) {
		$scope.master = {};

		$scope.update = function(user) {
			$scope.master = angular.copy(user);
		};

		$scope.reset = function() {
			$scope.user = angular.copy($scope.master);
		};

		$scope.reset();
	}]);
});