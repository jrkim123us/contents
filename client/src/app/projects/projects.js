angular.module('projects', ['services.crud'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/projects', {
		templateUrl:'projects/projects.tpl.html',
		controller:'ProjectsController'
	});
}])
.controller('ProjectsController', ['$scope', '$location', function ($scope, $location) {
}]);