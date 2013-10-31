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
.factory('ganttOptions', function() {
	var common = {
		order_branch : true,
		// grid column customization
		grid_width : 450,
		xml_date : "%Y-%m-%d",
		// drag_links : false,
		columns : [
			{name:"wbs", label:"WBS", tree:true, width:150 },
			{name:"text", label:"Task name", align: "left", width:100},
			{name:"start_date", label:"Start time", align: "center", width:90 },
			{name:"duration",   label:"Duration",   align: "center", width:70 },
			{name:"add", label:"", width:40 }
		]
	}
	// scale 기준에 대한 설정값
	var optionsPerType = {
		day : {
			scale_unit : "month", step : 1, date_scale : "%F, %Y", min_column_width : 50, scale_height : 90,
			subscales : [
				{unit:"week", step:1, template : weekScaleTemplate },
				{unit:"day", step:1, date:"%D" }
			]
		},
		month : {
			scale_unit : "year", step : 1, date_scale : "%Y", min_column_width : 50, scale_height : 90,
			subscales : [
				{unit:"month", step:3, template:quarterScaleTemplate},
				{unit:"month", step:1, date:"%M" }
			]
		},
		year : {
			scale_unit : "year", step : 1, date_scale : "%Y", min_column_width : 80, scale_height : 90,
			subscales : [
				{unit:"month", step:3, template:monthScaleTemplate}
			]
		}
	}
	var templates = {
		task_cell_class : task_cell_class,  // 주말 표시
		progress_text : progress_text
	}
	// gantt 꾸미기 template 함수
	function quarterScaleTemplate(date) {
		var result,dateToStr = gantt.date.date_to_str("%M");

		switch(dateToStr(date)) {
			case "Jan" : result = "1Q"; break;
			case "Apr" : result = "2Q"; break;
			case "Jul" : result = "3Q"; break;
			case "Oct" : result = "4Q"; break;
		}
		return result;
	}
	function monthScaleTemplate (date){
		var dateToStr = gantt.date.date_to_str("%M");
		var endDate = gantt.date.add(date, 2, "month");
		return dateToStr(date) + " - " + dateToStr(endDate);
	};

	function weekScaleTemplate(date) {
		var dateToStr = gantt.date.date_to_str("%M %d ");
		var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
		return dateToStr(date) + " - " + dateToStr(endDate);
	}
	/* gantt 전체 영역 template 정의 */
	function task_cell_class(item, date) {
		if(gantt.config.scale_unit ==="month" && (date.getDay() === 0 || date.getDay() === 6)){
			return "gantt_weekend";
		}
	}
	function progress_text(start, end, task) {
		return "<span style='text-align:left;'>"+Math.round(task.progress*100)+ "% </span>";
	}

	function set(type) {
		var options = {};

		angular.extend(angular.copy(common, options), optionsPerType[type]);

		angular.forEach(options, function(value, key){
			gantt.config[key] = value;
		});

		angular.forEach(templates, function(value, key){
			gantt.templates[key] = value;
		});
	}
	return {
		set : set
	};
})
.factory('ganttHadler', ['ganttOptions', function(ganttOptions) {
	function init(element, type) {
		ganttOptions.set(type);

		element.dhx_gantt({});
	}
	function parse(data) {
		gantt.clearAll();
		gantt.parse(data);
	}

	function render(type) {
		ganttOptions.set(type);

		gantt.render(type);
	}
	return {
		init : init,
		parse : parse,
		render : render
	};
}])
.directive('dhtmlxGantt', ['ganttHadler', function(ganttHadler) {
	return {
		require: '?ngModel',
		restrict : 'A',
		refresh: false,
		link: function(scope, element, attrs, ngModel) {

			if (ngModel) {
				ngModel.$render = function() {
					//To-Do: refresh
				}
			};

			ganttHadler.init(element, scope.currentScale);
		}
	}
}])
.controller('GanttController', ['$scope', '$location', '$route', '$routeParams', 'Gantt', 'ganttHadler'
	, function ($scope, $location, $route, $routeParams, Gantt, ganttHadler) {
	var firstRoute = $route.current
		defaultScale = 'day';

	$scope.currentWbs = $routeParams.wbs;
	$scope.currentScale = $location.hash()  || defaultScale;

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
		ganttHadler.render($scope.currentScale);
	}); // initialize the watch

	$scope.getTask = function () {
		Gantt.get({wbsId: $scope.currentWbs}, function(result) {
			$scope.currentTaskName = result.task.name;
			$scope.currentWbs = result.task.wbs;

			ganttHadler.parse({data : result.data})
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