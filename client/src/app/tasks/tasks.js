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
		controller:'GanttController'
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
			helper : getSortHelper, // postion:absolute 에서  diplay:table-cell 이 잘못 표시되는 현상 대비
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
.factory('ganttConfig', function() {
	var ganttConfig = {
		scale_unit : "month",
		step : 1,
		date_scale : "%F, %Y",
		min_column_width : 50,
		scale_height : 90,
		subscales : [
			{unit:"week", step:1, template : subscalesTmpl },
			{unit:"day", step:1, date:"%D" }
		],
		templates : {
			task_cell_class : task_cell_class, // 주말 표시
			progress_text : progress_text
		}
	};

	function subscalesTmpl(date) {
		var dateToStr = gantt.date.date_to_str("%d %M");
		var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
		return dateToStr(date) + " - " + dateToStr(endDate);
	}
	/* gantt 전체 영역 template 정의 */
	function task_cell_class(item, date) {
		if(date.getDay() === 0 || date.getDay() === 6){
			return "gantt_weekend";
		}
	}
	function progress_text(start, end, task) {
		return "<span style='text-align:left;'>"+Math.round(task.progress*100)+ "% </span>";
	}

	var options = {
		day : {
			config : {
				scale_unit : "day",
				step : 1,
				date_scale : "%d %M",
				scale_height : 27,
				subscales : []
			},
			templates : {
				date_scale : null
			}
		},
		week : {
			config : {
				scale_unit : "week",
				step : 1,
				scale_height : 50,
				subscales : [
					{unit:"day", step:1, date:"%D" }
				]
			},
			templates : {
				date_scale : weekScaleTemplate
			}
		},
		month : {
			config : {
				scale_unit : "month",
				date_scale : "%F, %Y",
				scale_height : 50,
				subscales : [
					{unit:"day", step:1, date:"%j, %D" }
				]
			},
			templates : {
				date_scale : null
			}
		},
		year : {
			config : {
				scale_unit : "year",
				step : 1,
				date_scale : "%Y",
				min_column_width : 50,
				scale_height : 90,
				subscales : [
					{unit:"month", step:3, template:monthScaleTemplate},
					{unit:"month", step:1, date:"%M" }
				]
			},
 			templates : {
 				date_scale : null
 			}
		}
	}
	function monthScaleTemplate (date){
		var dateToStr = gantt.date.date_to_str("%M");
		var endDate = gantt.date.add(date, 2, "month");
		return dateToStr(date) + " - " + dateToStr(endDate);
	};

	function weekScaleTemplate(date){
		var dateToStr = gantt.date.date_to_str("%d %M");
		var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
		return dateToStr(date) + " - " + dateToStr(endDate);
	};



	return ganttConfig;
})
.directive('dhtmlxGantt', [function() {
	return {
		require: '?ngModel',
		restrict : 'A',
		refresh: false,
		link: function(scope, element, attrs, ngModel) {
			opts = angular.extend({}, {}, scope.$eval(attrs.dhtmlxGantt));

			if (ngModel) {
				ngModel.$render = function() {
					//To-Do: refresh
				}
			};
			scope.gantt = element.dhx_gantt(opts);

			angular.forEach(opts.templates, function(fn, key){
				scope.gantt.templates[key] = fn;
			});
		}
	}
}])
.controller('GanttController', ['$scope', '$location', '$route', '$routeParams', 'Gantt', 'ganttConfig'
	, function ($scope, $location, $route, $routeParams, Gantt, ganttConfig) {
	var firstRoute = $route.current
		defaultScale = 'day';

	$scope.currentWbs = $routeParams.wbs;
	$scope.currentScale = $location.hash()  || defaultScale;
	$scope.ganttOption = ganttConfig;

	// wbsId 또는 scale 값이 변경 되었을 때 page reload 없이 처리하기 위함
	$scope.$on('$locationChangeSuccess', function(event, newPath, prevPath) {
		if($route.current.$$route.controller === 'GanttController' ){
			// Will not load only if my view use the same controller
			var hash = newPath.match(/#.*/);
			$scope.currentScale = hash ? hash[0].substring(1) : defaultScale;
			$scope.currentWbs = $route.current.params.wbs;
			$route.current = firstRoute;
			event.preventDefault();
		}
	});

	$scope.$watch('currentWbs', function() {
		$scope.getTask();
	}); // initialize the watch
	$scope.$watch('currentScale', function() {
		console.log('currentScale changed : ' + $scope.currentScale);
	}); // initialize the watch

	$scope.getTask = function () {
		Gantt.get({wbsId: $scope.currentWbs}, function(result) {
			$scope.currentTaskName = result.task.name;
			$scope.currentWbs = result.task.wbs;

			$scope.gantt.clearAll();
			$scope.gantt.parse({data : result.data});
		});
	}
}])
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
	// angular 제공하는 sortcompare 방식이 아니라서
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