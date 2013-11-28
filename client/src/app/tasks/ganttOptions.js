angular.module('tasks.ganttOptions', [])
.factory('ganttOptions', function() {
	var scaleType, users;
	var common = {
		order_branch : true, // dragging tasks only within the parent branch
		// grid column customization
		xml_date   : "%Y-%m-%d",
		task_date  : "%Y.%m.%d", // lightbox header date format
		grid_width : 440,
		drag_links : false,
		show_progress       : true, // loading spinner
		drag_progress       : false,
		round_dnd_dates     : false, // month, year scale에서 drag&drop 작업시 일정 정보가 scale 기준으로 rounding 되지 않게 함
		time_step           : 60 * 24, // 최소 처리 기준을 Day로 정함
		details_on_create   : false, // '+' button으로 task를 생성하고 lightbox를 호출하지 않음
		quick_info_enable   : false,
		quick_info_detached : true,
		columns : [
			{name:"wbs", label:"WBS", tree:true, width:200, template: wbsColumnTemplate },
			{name:"text", label:"Task", align: "left", width:200, template: textColumnTemplate},
			/*{name:"start_date", label:"시작일자", align: "center", width:90 },
			{name:"duration",   label:"기간",   align: "center", width:70 },
			{name:"holder",   label:"담당자",   align: "center", width:150, template: holderColumnTemplate},
			{name:"button",   label:"View",   align: "center", width:70 , template: subTaskColumnTemplate},*/
			{name:"add", label:"", width:40 }
		]
	};
	// scale 기준에 대한 설정값
	var optionsPerType = {
		day : {
			scale_unit : "month", step : 1, date_scale : "%F, %Y", min_column_width : 20, scale_height : 90,
			subscales : [
				{unit:"week", step:1, template : weekScaleTemplate },
				{unit:"day", step:1, date:"%D" }
			]
		},
		week : {
			scale_unit : "month", step : 1, date_scale : "%F, %Y",  min_column_width : 80, scale_height : 90,
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
			scale_unit : "year", step : 1, date_scale : "%Y", min_column_width : 20, scale_height : 90,
			subscales : [
				{unit:"month", step:3, template:quarterScaleTemplate}
			]
		}
	};
	var templates = {
		progress_text     : progress_text,
		task_class        : task_class,
		task_cell_class   : task_cell_class,  // 주말 표시
		quick_info_header : quick_info_header,
		quick_info_body   : quick_info_body,
		quick_info_footer : quick_info_footer,
		rightside_text    : rightside_text,
		leftside_text     : leftside_text
	};
	// column template 함수
	function wbsColumnTemplate(task) {
		var className = parseInt(task.duration, 10) === 0 ? "text-success" : task.leaf ? "text-primary" : "";
		return '<p class="' + className + '" title="' + task.wbs + '">' + task.wbs + '</p>';
	}
	function textColumnTemplate(task) {
		var className = parseInt(task.duration, 10) === 0 ? "text-success" : task.leaf ? "text-primary" : "";
		return '<p class="' + className + '" title="' + task.name + '">' + task.name + '</p>';
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
	/*function monthScaleTemplate (date){
		var dateToStr = gantt.date.date_to_str("%M");
		var endDate = gantt.date.add(date, 2, "month");
		return dateToStr(date) + " - " + dateToStr(endDate);
	}*/

	function weekScaleTemplate(date) {
		var dateToStr = gantt.date.date_to_str("%m.%d ");
		var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
		return dateToStr(date) + " - " + dateToStr(endDate);
	}
	// Task 좌/우측 보조 정보 표시
	function rightside_text(start, end, task){
		if(task.duration === 0) return "";

		var dateToStr = gantt.date.date_to_str("%m.%d");
		return dateToStr(end);
	}
	function leftside_text(start, end, task){
		var dateToStr = gantt.date.date_to_str("%m.%d");
		return dateToStr(start);
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
		return '<h4 class="modal-title text-info" title="' + task.name +'">' + task.name + '</h4>';
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
	function quick_info_footer(start, end, task) {
		var viewBtn = !task.leaf ? '' +
			'<a href="/tasks/gantt/' + task.wbs +'#' + scaleType + '"class="btn btn-info" role="button">' +
				'<span class="glyphicon glyphicon-zoom-in"></span> View' +
			'</a>' : '',
			result = '' + viewBtn +
			'<button type="button" class="delete btn btn-danger"><span class="glyphicon glyphicon-trash"></span> Delete</button>' +
			'<button type="submit" class="edit btn btn-success"><span class="glyphicon glyphicon-pencil"></span> Edit</button>';
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
	function setQuickInfoEnable(enable) {
		gantt.config.quick_info_enable = enable;
		// 현재 Quick info 떠 있는 경우 Hide
		if(!enable)
			gantt.callEvent('onEmptyClick');
	}
	return {
		initialize  : initialize,
		setUserData : setUserData,
		setQuickInfoEnable : setQuickInfoEnable
	};
});