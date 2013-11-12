angular.module('tasks.gantt', [
	'tasks.ganttSortable',
	'tasks.ganttOptions',
	'tasks.ganttOverWriteHandler',
	'tasks.ganttEventsHandler',
	'tasks.ganttHandler',
	'tasks.form'
])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/tasks/gantt/:wbs', {
		templateUrl:'tasks/gantt.tpl.html',
		controller:'GanttController'
	});
}])
.directive('dhtmlxGantt', ['ganttHandler', function(ganttHandler) {
	return {
		require: '?ngModel',
		restrict : 'A',
		refresh: false,
		link: function(scope, element, attrs, ngModel) {
			//To-Do: refresh
			if (ngModel) {ngModel.$render = function() { } };

			ganttHandler.initialize(element, scope.currentScale);
		}
	}
}])
.controller('GanttController', ['$scope', '$location', '$route', '$routeParams', 'Gantt', 'ganttHandler'
	, function ($scope, $location, $route, $routeParams, Gantt, ganttHandler) {
	var firstRoute = $route.current
		defaultScale = 'month';

	$scope.currentWbs = $routeParams.wbs;
	$scope.currentScale = $location.hash()  || defaultScale;

	// wbsId 또는 scale 값이 변경 되었을 때 page reload 없이 처리하기 위함
	$scope.$on('$locationChangeSuccess', function(event, newPath, prevPath) {
		if($route.current.$$route.controller && $route.current.$$route.controller === 'GanttController' ){
			// Will not load only if my view use the same controller
			var hash = newPath.match(/#.*/);
			$scope.currentScale = hash ? hash[0].substring(1) : $scope.currentScale;
			$scope.currentWbs = $route.current.params.wbs;
			$route.current = firstRoute;
			event.preventDefault();
		}
	});

	$scope.$watch('currentWbs', function() {
		$scope.isRoot = ($scope.currentWbs === "1");
		$scope.getTask();
	}); // initialize the watch
	$scope.$watch('currentScale', function() {
		ganttHandler.render($scope.currentScale);
	}); // initialize the watch

	$scope.getTask = function () {
		Gantt.get({wbsId: $scope.currentWbs}, function(result) {
			$scope.currentTaskName = result.task.name;
			$scope.currentWbs = result.task.wbs;

			ganttHandler.parse(result)
		});
	}
}]);