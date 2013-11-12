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
		grid_width        : 360,
		xml_date          : "%Y-%m-%d",
		task_date         :  "%Y.%m.%d", // lightbox header date format
		drag_links        : false,
		show_progress     : true, // loading spinner
		drag_progress     : false,
		round_dnd_dates   : false, // month, year scale에서 drag&drop 작업시 일정 정보가 scale 기준으로 rounding 되지 않게 함
		details_on_create : false, // '+' button으로 task를 생성하고 lightbox를 호출하지 않음
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
		week : {
			scale_unit : "month", step : 1, date_scale : "%F, %Y",  min_column_width : 100, scale_height : 90,
			subscales : [
				{unit:"week", step:1, template : weekScaleTemplate},
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
		progress_text     : progress_text,
		task_class        : task_class,
		task_cell_class   : task_cell_class,  // 주말 표시
		quick_info_header : quick_info_header,
		quick_info_body   : quick_info_body
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
		return getUsersName(task.worker.length);
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
		var dateToStr = gantt.date.date_to_str("%m.%d ");
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
		return "<span style='text-align:left;'>" + parseFloat(task.progress * 100).toFixed(1) + "% </span>";
	}
	function task_class(start,end,task) {
		var result = "";
		if(parseInt(task.duration, 10) === 0)
			result = "milestone";
		return result;
	}
	function quick_info_header(start, end, task) {
		return '<h4 class="modal-title text-info" title="' + task.text +'">' + task.text + '</h4>';
	}
	function quick_info_body(start, end, task){
		var date = gantt.templates.task_time(start, end, task),
			result = '' +
				'<div class="well">' +
					'<dl class="dl-horizontal">' +
						'<dt>wbs</dt>' +
						'<dd><p class="text-muted">' + task.wbs + '</p></dd>' +
						'<dt>date</dt>' +
						'<dd><p class="text-muted">' + date + '</p></dd>' +
						'<dt>progress</dt>' +
						'<dd><p class="text-danger">' + parseFloat(task.progress * 100).toFixed(1) + '%</p></dd>'+
						'<dt>worker</dt>' +
						'<dd><p class="text-info">' + getUsersName(task.worker) + '</p></dd>' +
						'<dt>approver</dt>' +
						'<dd><p class="text-info">' + getUsersName(task.approver) + '</p></dd>' +
					'</dl>'+
				'</div>';
		return result;
	}

	function getUsersName(ids) {
		var result = '', splliter = '';
		for(var inx = 0, ilen = ids.length ; inx < ilen ; inx ++) {
			for(var jnx = 0, jlen = users.length ; jnx < jlen ; jnx++) {
				if(ids[inx] === users[jnx].id) {
					result += splliter + users[jnx].name.full;
					splliter = ', ';
					continue;
				}
			}
		}
		return result;
	}

	function initialize(type) {
		var options = {};
		scaleType = type;

		angular.extend(angular.copy(common, options), optionsPerType[type]);
		// angular.extend(angular.copy(common, options), {});

		angular.forEach(options, function(value, key){
			gantt.config[key] = value;
		});

		angular.forEach(templates, function(value, key){
			gantt.templates[key] = value;
		});
	}
	function setUserData(data) {
		users = data.users;
	}
	return {
		initialize  : initialize,
		setUserData : setUserData
	};
})
.factory('ganttOverWriteHandler', [function() {
	function initialize() {
		// gantt 의 '+' 이벤트 처리 함수 overwrite
		gantt._click.gantt_add = dhtmlx.bind(function (event, id) {
			var task = id ? this.getTask(id) : !1, start_date = "";
			if(task) start_date = task.start_date;
			else {
				var order  = this._order[0];
				start_date = orders ? this.getTask(order).start_date : this.getState().min_date
			}
			task && (task.$open = !0);
			var newTask = {
				wbs        : task.wbs + '.' + (this.getChildren(task.id).length + 1),
				name       : this.locale.labels.new_task,
				start_date : this.templates.xml_format(start_date),
				end_date   : this.templates.xml_format(start_date),
				duration : 0,
				progress : 0,
				leaf     : true,
				create   : true,
				parent   : task
			}
			// onBeforeTaskCreated event를 추가하여 custom form 화면을 호출하도록 한다.
			this.open(task.id);
			this.callEvent("onBeforeTaskCreated", [newTask]);
		}, gantt);
		// gantt quick info box overwrite
		gantt._init_quick_info = function () {
			if (!this._quick_info_box) {
				var element = this._quick_info_box = document.createElement("div");
				element.className = "dhx_cal_quick_info";

				var inner = '' +
				'<div class="modal-modal">' +
					'<div class="modal-content">' +
						'<div class="modal-header"></div>' +
						'<div class="modal-body"></div>' +
						'<div class="modal-footer">' +
							'<button type="button" class="delete btn btn-danger"><span class="glyphicon glyphicon-trash"></span> Delete</button>' +
							'<button type="submit" class="edit btn btn-success"><span class="glyphicon glyphicon-pencil"></span> Edit</button>' +
						'</div>' +
					'</div>' +
				'</div>';
				element.innerHTML = inner;

				dhtmlxEvent(element, "click", function (ev) {
					ev = ev || event, gantt._qi_button_click(ev.target || ev.srcElement)
				});
				gantt.config.quick_info_detached && dhtmlxEvent(gantt.$task_data, "scroll", function () {
					gantt.hideQuickInfo()
				});
			}
			return this._quick_info_box
		}
		gantt._qi_button_click = function (ev) {
			var element = gantt._quick_info_box;
			if (ev && ev != element) {
				var className = ev.className;
				if (-1 != className.indexOf("btn")) {
					var boxId = gantt._quick_info_box_id;
					gantt.$click.buttons[className.split(" ")[0]](boxId)
				} else gantt._qi_button_click(ev.parentNode)
			}
		}
		gantt._fill_quick_data = function (taskId) {
			var task = gantt.getTask(taskId),
				element = gantt._quick_info_box;
			gantt._quick_info_box_id = taskId;
			var children = element.firstChild.firstChild.firstChild;
			children.innerHTML = gantt.templates.quick_info_header(task.start_date, task.end_date, task);
			children = children.nextSibling;
			children.innerHTML = gantt.templates.quick_info_body(task.start_date, task.end_date, task);
		}
		// quick info 에 사용하는 edit 함수 overwrite
		gantt.$click.buttons.edit = function (id) {
			taskModalHandler.openModal(gantt.getTask(id));
		}
	}
	return {
		initialize  : initialize
	}
}])
.factory('ganttEventsHandler', ['ganttSortable', 'ganttOverWriteHandler', function(ganttSortable, ganttOverWriteHandler) {
	var ganttEvents = {
		'onGanttReady' : onGanttReady,
		'onLoadEnd'         : onLoadEnd,
		'onTaskDblClick'    : onTaskDblClick,
		'onBeforeTaskCreated' : onBeforeTaskCreated,
		'onBeforeTaskChanged' : onBeforeTaskChanged,
		'onAfterTaskUpdate' : onAfterTaskUpdate,
		'onAfterTaskDrag'   : onAfterTaskDrag
	}

	function initialize() {
		angular.forEach(ganttEvents, function(evFn, evName){
			gantt.attachEvent(evName, evFn);
		});
	}

	function onGanttReady() {
		ganttOverWriteHandler.initialize();
	}
	function onLoadEnd() {
		ganttSortable.sort();
	}
	function onTaskDblClick(id, event) {
		taskModalHandler.openModal(gantt.getTask(id));
	}
	function onBeforeTaskCreated(task) {
		taskModalHandler.openModal(task);
		console.log('onBeforeTaskCreated : ' + task);
	}
	function onBeforeTaskChanged(id, mode, task) {
		console.log('onBeforeTaskChanged : ' + id + '/' + mode);
		return true;
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
		initialize  : initialize
	}
}])
.factory('ganttHandler', ['ganttOptions', 'taskModalHandler', 'ganttEventsHandler',
	function(ganttOptions, taskModalHandler, ganttEventsHandler) {

	// TO-DO : ganttHandler와 modal handler 분리 필요함 TaskController 에서 사용 대비
	var taskModal = null;
	function initialize(element, type) {
		ganttOptions.initialize(type);

		attachEvents();

		element.dhx_gantt({});
	}
	function parse(data) {
		ganttOptions.setUserData(data);
		gantt.clearAll();
		gantt.parse(data);
	}

	function render(type) {
		ganttOptions.initialize(type);

		gantt.render(type);
	}
	function attachEvents() {
		ganttEventsHandler.initialize();
	}
	return {
		initialize : initialize,
		parse      : parse,
		render     : render
	};
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