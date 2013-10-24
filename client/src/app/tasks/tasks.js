angular.module('tasks', ['services.crud'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/tasks/sync/:wbs', {
		templateUrl:'tasks/tasks.tpl.html',
		controller:'TasksController'
	});
}])
.controller('TasksController', ['$scope', '$location', '$routeParams', 'Tasks', function ($scope, $location, $routeParams, Tasks) {
	$scope.currentWbs = $routeParams.wbs;
	$scope.currentPath = $location.path().replace($routeParams.wbs, '');

	$scope.$watch('currentWbs', function() {
		$scope.getTask();
	}); // initialize the watch

	$scope.getTask = function () {
		Tasks.get({wbsId: $scope.currentWbs}, function(result) {
			$scope.currentTaskName = result.task.name;
			$scope.subTaskList = result.childs;
			$scope.breadcrumbList = getParentsWbs(result.task.wbs);
		});
	}

	function getParentsWbs(currentWbs) {
		var results = [],
			wbs = '',
			spiltedWbs = currentWbs.split('.'),
			length = spiltedWbs.length;

		angular.forEach(spiltedWbs, function(value, inx){
			wbs += (inx === 0 ? '' : '.') + value;

			if(inx < length - 1 )
				results.push({wbs : wbs, href : $scope.currentPath + wbs });
		});

		return results;
	}
}]);
/*.directive('ngWbs', function($parse, $compile) {
	return {
		restrict: 'A',
		controller : 'TasksController',
		template:
				'<li ng-repeat="parent in breadcrumbList">' +
					'<a href="{{parent.href}}">{{parent.wbs}}</a>' +
				'</li>' +
				'<li class="active">' +
					'{{currentWbs}}' +
				'</li>',
		link: function($scope, $element, $attrs, $controller) {
			$scope.$watch('currentWbsName', function(newValue, oldValue, $scope) {
				console.log('wbsBreadcrumb called');
			});
		}
	};
}); directive의 활용도가 생각보다 적어 tpl로 이동*/