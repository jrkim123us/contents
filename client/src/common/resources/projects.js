angular.module('resources.projects', ['ngResource']);
angular.module('resources.projects').factory('Projects', ['$resource', function ($resource) {
	return  $resource('/projects', {}, {
		query: {method: 'POST', isArray: true}
	});
}]);