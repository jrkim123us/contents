angular.module('resources.tasks', ['ngResource'])
.factory('Tasks', ['$resource', function ($resource) {
	return  $resource('/tasks/:wbs', {
		wbs : '@wbs'
	});
}])
.factory('Gantt', ['$resource', function ($resource) {
	return  $resource('/gantt/:wbs', {});
}]);
