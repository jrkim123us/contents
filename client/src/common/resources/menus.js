angular.module('resources.menus', ['ngResource']);
angular.module('resources.menus').factory('Menus', ['$resource', function ($resource) {
	return  $resource('/menus', {}, {
		query: {method: 'POST', isArray: true}
	});
}]);