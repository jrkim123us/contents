angular.module('tasks.ganttOverWriteHandler', [])
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