angular.module('resources.tasks', ['ngResource']);
angular.module('resources.tasks').factory('Tasks', ['$resource', function ($resource) {
	return  $resource('/tasks/:wbsId', {});
}]);