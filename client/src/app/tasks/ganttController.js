angular.module('tasks.gantt', [
	'tasks.form'
])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/tasks/gantt/:wbs', {
		templateUrl:'tasks/gantt.tpl.html',
		controller:'GanttController'
	});
}])
.factory('ganttSortable', function() {
	function sortByWbs(itemA, itemB) {
		var splliter = '.', result = 0,
			arrayA = itemA.wbs.split(splliter), arrayB = itemB.wbs.split(splliter),
			lengthA = arrayA.length, lengthB = arrayB.length;

		if (lengthA === lengthB) {
			for(var inx = 0 ; inx < lengthA ; inx++) {
				var valA = parseInt(arrayA[inx], 10), valB = parseInt(arrayB[inx], 10);
				if(valA === valB)
					continue;
				else if(valA > valB) {
					result = 1;
					break;
				} else {
					result = -1;
					break;
				}
			}
		} else
			result = lengthA > lengthB ? 1 : -1;
		return result;
	}

	function sort(type) {
		var fn;
		switch(type) {
			case 'wbs' : fn = sortByWbs; break;
			default: fn = sortByWbs; break;
		}

		gantt.sort(fn);
	}

	return {
		sort : sort
	}
})
.factory('ganttOptions', function() {
	var scaleType, users;
	var common = {
		order_branch : true,
		// grid column customization
		grid_width : 360,
		xml_date : "%Y-%m-%d",
		show_progress : true, // loading spinner
		drag_links : false,
		drag_progress : false,
		task_date :  "%Y.%m.%d", // lightbox header date format
		columns : [
			{name:"wbs", label:"WBS", tree:true, width:150, template: wbsColumnTemplate },
			{name:"text", label:"Task", align: "left", width:100, template: textColumnTemplate},
			/*{name:"start_date", label:"시작일자", align: "center", width:90 },
			{name:"duration",   label:"기간",   align: "center", width:70 },
			{name:"holder",   label:"담당자",   align: "center", width:150, template: holderColumnTemplate},*/
			{name:"button",   label:"View",   align: "center", width:70 , template: subTaskColumnTemplate},
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
		progress_text : progress_text,
		task_class : task_class
	}
	// column template 함수
	function wbsColumnTemplate(task) {
		var className = parseInt(task.duration, 10) === 0 ? "text-success" : task.leaf ? "text-primary" : "";
		return '<p class="' + className + '" title="' + task.wbs + '">' + task.wbs + '</p>'
	}
	function textColumnTemplate(task) {
		var className = parseInt(task.duration, 10) === 0 ? "text-success" : task.leaf ? "text-primary" : "";
		return '<p class="' + className + '" title="' + task.name + '">' + task.name + '</p>'
	}

	function holderColumnTemplate(task) {
		var result = '', splliter = '';

		for(var inx = 0, ilength = task.worker.length ; inx < ilength ; inx ++) {
			for(var jnx = 0, jlength = users.length ; jnx < jlength ; jnx++) {
				if(task.worker[inx] === users[jnx].id) {
					result += splliter + users[jnx].name.full;
					splliter = ', ';
					continue;
				}
			}
		}
		return result;
	}
	function subTaskColumnTemplate(task) {
		var result = '';
		if(task.parent && (task.wbs === '1.1' || task.wbs === '1.4'))
			result = '<a href="/tasks/gantt/' + task.wbs +'#' + scaleType + '" class="btn btn-info btn-xs" role="button">View</a>';

		return result;
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
	 // gantt 전체 영역 template 정의
	function task_cell_class(item, date) {
		if(gantt.config.scale_unit ==="month" && (date.getDay() === 0 || date.getDay() === 6)){
			return "gantt_weekend";
		}
	}
	function progress_text(start, end, task) {
		return "<span style='text-align:left;'>"+Math.round(task.progress*100)+ "% </span>";
	}
	function task_class(start,end,task) {
		var result = "";
		if(parseInt(task.duration, 10) === 0)
			result = "milestone";
		return result;
	}

	function set(type) {
		var options = {};
		scaleType = type;

		angular.extend(angular.copy(common, options), optionsPerType[type]);

		angular.forEach(options, function(value, key){
			gantt.config[key] = value;
		});

		angular.forEach(templates, function(value, key){
			gantt.templates[key] = value;
		});
	}
	function setUsers(data) {
		users = data.users;
	}
	return {
		set      : set,
		setUsers : setUsers
	};
})
.factory('ganttHandler', ['ganttOptions', 'ganttSortable', 'taskModalHandler', function(ganttOptions, ganttSortable, taskModalHandler) {
	// TO-DO : ganttHandler와 modal handler 분리 필요함 TaskController 에서 사용 대비
	var taskModal = null;
	function init(element, type) {
		ganttOptions.set(type);

		attachEvents();

		element.dhx_gantt({});
	}
	function parse(data) {
		ganttOptions.setUsers(data);
		gantt.clearAll();
		gantt.parse(data);
	}

	function render(type) {
		ganttOptions.set(type);

		gantt.render(type);
	}

	function attachEvents() {
		gantt.attachEvent('onLoadEnd', onLoadEnd);
		gantt.attachEvent('onTaskDblClick', onTaskDblClick);
		gantt.attachEvent('onAfterTaskUpdate', onAfterTaskUpdate);
		gantt.attachEvent('onAfterTaskDrag', onAfterTaskDrag);
	}
	function onLoadEnd() {
		ganttSortable.sort();
	}
	function onTaskDblClick(id, event) {
		taskModalHandler.openModal(gantt.getTask(id));
	}
	function onAfterTaskUpdate(id, task) {
		var tasks = [];
		tasks.push(task);
		while(gantt.isTaskExists(task.parent)) {
			task = gantt.getTask(task.parent);
			tasks.push(task);
		}
		console.log('onAfterTaskUpdate : ' + tasks);
	}
	function onAfterTaskDrag(id, mode, event) {
		// console.log('onAfterTaskDrag : ' + mode);
	}
	return {
		init : init,
		parse : parse,
		render : render
	};
}])
.directive('dhtmlxGantt', ['ganttHandler', function(ganttHandler) {
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

			ganttHandler.init(element, scope.currentScale);
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