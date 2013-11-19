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
	return  $resource('/gantt/dnd/:start/:end', {
		start : '@wbs.dragStart.parent.wbs',
		end   : '@wbs.dragEnd.parent.wbs'
	});
}])
.factory('Gantt', ['$resource', function ($resource) {
	return  $resource('/gantt/:wbs', {});
}]);