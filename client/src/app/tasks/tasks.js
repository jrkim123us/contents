angular.module('tasks', [
	'services.crud',
	'ui.sortable'
])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/tasks/sync/:wbs', {
		templateUrl:'tasks/tasks.tpl.html',
		controller:'TasksController'
	});
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
			helper : getSortHelper, // postion:absolute 상태에서 diplay:table-cell 정상 표시 안되는 문제 해결
			start  : onSortStarted,
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
	function onSortStarted(event, ui) {
		var test01 = angular.element('.ui-sortable').sortable('toArray'),
			test02 = angular.element('.ui-sortable').sortable('serialize');

		console.log(test01 + '/' + test02);
	}
	function onSortUpdated(event, ui) {
		var test01 = angular.element('.ui-sortable').sortable('toArray'),
			test02 = angular.element('.ui-sortable').sortable('serialize');

		console.log(test01 + '/' + test02);
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
	// wbs 기준으로 sorting 하기
	// angular 제공하는 sort는 compare 방식이 아니라서
	// 각 level 별 제곱수를 더하여 sorting 함
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