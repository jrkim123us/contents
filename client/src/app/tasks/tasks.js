angular.module('tasks', [
	'services.crud',
	'ui.sortable'
])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/tasks/sync/:wbs', {
		templateUrl:'tasks/tasks.tpl.html',
		controller:'TasksController'
	})
	.when('/tasks/gantt/:wbs', {
		templateUrl:'tasks/gantt.tpl.html',
		controller:'TasksGanttController'
	});
}])
.controller('TasksGanttController', ['$scope', '$location', '$routeParams', 'Tasks', function ($scope, $location, $routeParams, Tasks) {
}])
.factory('taskSortable', function(){
	var taskSortable = {
		sortableOptions : {
			cursor: "intersect",
			tolerance: 'pointer',
			revert: 'invalid',
			placeholder: 'active',
		 	forceHelperSize: true,
			axis: 'y',
			helper : getSortHelper, // postion:absolute �태�서 diplay:table-cell �상 �시 �되문제 �결
			// start  : onSortStarted,
			update : onSortUpdated
		}
	};
	function getSortHelper(event) {
		var element = 	'<div class="table-responsive">' +
							'<table  class="table"><tbody></tbody></table>' +
						'</div>';
		return angular.element(element)
					.find('tbody').append(angular.element(event.target).closest('tr').clone()).end().appendTo('div.container');
	}
	function onSortUpdated(event, ui) {
		var updatedOrders = angular.element('.ui-sortable').sortable('toArray', {attribute: 'wbs'});
	}

	return taskSortable;
})
.controller('TasksController', ['$scope', '$location', '$routeParams', 'Tasks', 'taskSortable', function ($scope, $location, $routeParams, Tasks, taskSortable) {
	$scope.currentWbs = $routeParams.wbs;
	$scope.currentPath = $location.path().replace($routeParams.wbs, '');
	$scope.sortableOptions = taskSortable.sortableOptions;

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
	// wbs 기�로 sorting �기
	// angular �공�는 sortcompare 방식�니�서
	// �level 볜곱�� �하sorting 
	$scope.sortWbs = function(task) {
		var wbs = task.wbs,
 			sortNum = 0;

 		angular.forEach(wbs.split('.'), function(value, inx){
 			sortNum += value * Math.pow(100, inx);
 		});
		return sortNum;
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