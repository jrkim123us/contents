angular.module('resources.tasks', ['ngResource'])
.factory('Tasks', ['$resource', function ($resource) {
	return  $resource('/tasks/:wbs', {
		wbs : '@wbs'
	}, {
		'create' : {
			method: 'PUT'
		}
	});
}])
.factory('GanttDnD', ['$resource', function ($resource) {
	return  $resource('/gantt/dnd/:type', {
		type : '@type'
	}, {
		resize: {
			method: 'POST'
		}
	});
}])
.factory('Gantt', ['$resource', function ($resource) {
	return  $resource('/gantt/:wbs', {});
}]);