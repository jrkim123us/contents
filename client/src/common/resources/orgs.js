angular.module('resources.orgs', ['ngResource'])
.factory('Orgs', ['$resource', function ($resource) {
	return  $resource('/orgs', {});
}])