angular.module('resources.tasks', ['ngResource'])
.factory('Tasks', ['$resource', function ($resource) {
	return  $resource('/tasks/:wbsId', {});
}])
.factory('Gantt', ['$resource', function ($resource) {
	return  $resource('/gantt/:wbsId', {});
}]);
