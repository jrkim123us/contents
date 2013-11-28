angular.module('tasks.ganttEventsHandler', [])
.factory('ganttEventHandlerUtil', [function() {
	function setTaskProjectDuration(task, isProjectDuration) {
		task.$no_start = isProjectDuration;
		task.$no_end   = isProjectDuration;
	}
	function setTaskLeaf(task, isLeaf) {
		task.leaf = isLeaf;
	}
	function setTaskToParent(task, isParent) {
		// create
		var isProjectDuration = false, isLeaf = true;
		if(isParent) {
			isProjectDuration = true;
			isLeaf = false;
		}
		setTaskProjectDuration(task, isProjectDuration);
		setTaskLeaf(task, isLeaf);
	}
	// Task Drag & Drop 또는 삭제로 인하여 순서가 변경되는 경우
	// 그 기준에 맞춰 WBS 데이터 변경
	function resetWbs(parent, childrenIds) {
		var child = null, grandChildren = null;
		for(var inx = 0, ilen = childrenIds.length ; inx < ilen ; inx++) {
			child = gantt.getTask(childrenIds[inx]);
			child.wbs = parent.wbs + '.' + (inx + 1);

			grandChildren = gantt.getChildren(child.id);
			if(gantt.getChildren.length > 0)
				resetWbs(child, grandChildren);
		}
	}
	return {
		resetWbs        : resetWbs,
		setTaskToParent : setTaskToParent
	};
}])
.factory('ganttRowDnDEventHandler', ['GanttDnD', 'ganttEventHandlerUtil', function(GanttDnD, handlerUtil) {
	var dragStart = null;
	var events = {
		// Dragging tasks only within the parent branch
		'onRowAfterDragStart' : onRowAfterDragStart,
		'onRowDragEnd'        : onRowDragEnd
	};
	function initialize() {
		angular.forEach(events, function(evFn, evName){
			gantt.attachEvent(evName, evFn);
		});
	}
	// Grid 영역 Drag & Drop 처리 이벤트
	function onRowAfterDragStart(taskId, event) {
		dragStart = {};
		setDragInfo(dragStart, taskId);
	}
	function onRowDragEnd(movedId, nextId) {
		var params = {type : 'row'}, isMoved = true;
// back-end 영역 처리
		if(!dragStart.parent) // 최상위 항목의 이동은 지원하지 않는다.
			return;
		isMoved = beforeUpdateServer(params, movedId);

		if(isMoved)
			GanttDnD.save(params, function(result) {
				// front-end 영역 처리
				onAfterUpdateServer(params);
			});
	}
	function beforeUpdateServer(params, movedId) {
		var isDownward = true,
			isChangeParent = false;

		var dragEnd = {};
		setDragInfo(dragEnd, movedId);
		params.moved = {
			id : movedId,
			index : dragEnd.index,
			parent : {
				id : dragEnd.parent.id,
				wbs : dragEnd.parent.wbs
			}
		};
		// 부모가 바뀐 경우
		if(dragStart.parent.id !== dragEnd.parent.id) {
			params.isChangeParent = true;
			params.shift = [{
				parent : {id : dragStart.parent.id, wbs : dragStart.parent.wbs },
				start : dragStart.index + 1, inc : -1
			}, {
				parent : {id : dragEnd.parent.id, wbs : dragEnd.parent.wbs },
				start : dragEnd.index, inc : 1
			}];
		}
		else {
		// 부모가 변경되지 않은 경우
			var start, end, inc;
			if(dragStart.index === dragEnd.index)
				return false;
			else if(dragStart.index < dragEnd.index) {
				// 동일 부모 안에서 아래로 이동
				params.isDownward = true;

				start = dragStart.index + 1;
				end = dragEnd.index;
				inc = -1;

			} else {
				// 동일 부모 안에서 위로 이동
				start = dragEnd.index;
				end = dragStart.index - 1;
				inc = 1;
			}

			params.shift = [{
				start : start, end : end, inc : inc,
				parent : {id : dragEnd.parent.id, wbs : dragEnd.parent.wbs }
			}];
		}

		return true;
	}
	function onAfterUpdateServer(params) {
		// front-end 영역 처리
		var parent;
		for(var inx = 0, ilen = params.shift.length ; inx < ilen ; inx++) {
			parent = params.shift[inx].parent;
			handlerUtil.resetWbs(parent, gantt.getChildren(parent.id));
		}

		gantt.refreshData();

		dhtmlx.message({
			type: "modal",
			text: 'saved successfully',
			expire: 3000
		});

		dragStart = null;
	}
	function setDragInfo(info, taskId) {
		var task = gantt.getTask(taskId);

		info.index  = gantt.getTaskIndex(taskId) + 1;
		info.parent = gantt.getTask(task.parent);
	}
	// Task Drag & Drop 또는 삭제로 인하여 순서가 변경되는 경우
	// 그 기준에 맞춰 WBS 데이터 변경
	/*function resetWbs(parent, childrenIds) {
		var child = null, grandChildren = null;
		for(var inx = 0, ilen = childrenIds.length ; inx < ilen ; inx++) {
			child = gantt.getTask(childrenIds[inx]);
			child.wbs = parent.wbs + '.' + (inx + 1);

			grandChildren = gantt.getChildren(child.id);
			if(gantt.getChildren.length > 0)
				resetWbs(child, grandChildren);
		}
	}*/
	return {
		initialize : initialize
	};
}])
.factory('ganttTaskDnDEventHandler', ['GanttDnD', function(GanttDnD) {
	var resizeStart = null;
	var events = {
		'onBeforeTaskChanged' : onBeforeTaskChanged,
		'onAfterTaskDrag'     : onAfterTaskDrag
	};
	function initialize() {
		angular.forEach(events, function(evFn, evName){
			gantt.attachEvent(evName, evFn);
		});
	}
	function onBeforeTaskChanged(id, mode, task) {
		if(mode === 'resize' || mode === 'move') {
			resizeStart = {
				task : {
					id         : task.id,
					start_date : task.start_date,
					end_date   : task.end_date
				}
			};
			setResizeParentInfo(resizeStart, task);
		}
		return true;
	}
	function onAfterTaskDrag(id, mode, event) {
		if(mode === 'resize' || mode === 'move') {
			var params = {type: 'resize'}, isResized = false;

			isResized = beforeUpdateServer(params, id);

			if(isResized)
				GanttDnD.resize(params, function(result) {
					onAfterUpdateServer();
				});
		}
	}
	function beforeUpdateServer(params, id) {
		var resizeEnd = {}, result = false;
		var task = gantt.getTask(id);
		setResizeParentInfo(resizeEnd, task);

		if(isDiffDate(resizeStart.task.start_date, task.start_date) || isDiffDate(resizeStart.task.end_date, task.end_date)) {
			result = true;
			// 서버단에서는 startDate, endDate로 구성됨
			params.task = {
				id        : id,
				parent    : task.parent,
				startDate : task.start_date,
				duration  : task.duration
			};
		}
		resetResizeStart();

		return result;
	}
	function onAfterUpdateServer() {
		dhtmlx.message({
			type: "modal",
			text: 'saved successfully',
			expire: 3000
		});
	}
	function isDiffDate(dateA, dateB) {
		return dateA.getTime() !== dateB.getTime();
	}
	function setResizeParentInfo(info, task) {
		var parent = gantt.getTask(task.parent);
		info.parent = {
			id         : parent.id,
			wbs        : parent.wbs,
			start_date : parent.start_date,
			end_date   : parent.end_date
		};
	}
	function resetResizeStart() {
		resizeStart = null;
	}
	return {
		initialize : initialize
	};
}])
.factory('ganttEventsHandler', [
		'ganttSortable', 'ganttOverWriteHandler', 'taskModalHandler',
		'ganttRowDnDEventHandler', 'ganttTaskDnDEventHandler', 'ganttEventHandlerUtil',
		'GanttDnD',
	function(ganttSortable, ganttOverWriteHandler, taskModalHandler, rowDnDHandler, taskDnDHandler, handlerUtil, GanttDnD) {
	var taskModal;
	var ganttEvents = {
		'onGanttReady'        : onGanttReady,
		'onLoadEnd'           : onLoadEnd,
		'onTaskClick'         : onTaskClick,
		'onTaskDblClick'      : onTaskDblClick,
		'onGridHeaderClick'   : onGridHeaderClick,
		'onBeforeTaskCreated' : onBeforeTaskCreated,
		'onBeforeTaskChanged' : onBeforeTaskChanged,
		'onAfterTaskUpdate'   : onAfterTaskUpdate,
		'onAfterTaskDrag'     : onAfterTaskDrag
	};
	function initialize() {
		angular.forEach(ganttEvents, function(evFn, evName){
			gantt.attachEvent(evName, evFn);
		});

		rowDnDHandler.initialize();
		taskDnDHandler.initialize();
	}
	function openModal(task) {
		var originalTask = angular.copy(task);
		taskModal = taskModalHandler.openModal(task);

		taskModal.result
			.then(function(args) { // save 버튼으로 닫힌 경우
				if(args.length > 1 ) {
					processTaskOnGantt(args[0], args[1]);

					dhtmlx.message({
						type: "modal",
						text: 'saved successfully',
						expire: 3000
					});
				}
			})
			.catch(function(reason) { // cancel 버튼 등 reject 경우
				// console.log('closed unexpected');
				if(reason === "backdrop click") {
					console.log('To-Do: closed unexpected');
					// task 변경 전으로 수정해야 함
				}
			})
			.finally(function() { // 무조건 실행
				gantt.refreshData();
			});
	}

	function processTaskOnGantt(type, task) {
		var parent = gantt.getTask(task.parent);
		var childrenIds;

		if(type === 'create') {
			gantt.addTask(task);
			gantt.showTask(task.id);

			handlerUtil.setTaskToParent(parent, true);
		} else if (type === 'delete') {
			gantt.deleteTask(task.id);

			childrenIds = gantt.getChildren(parent.id);
			if(childrenIds.length === 0) {
				handlerUtil.setTaskToParent(parent, false);
			}
			else
				handlerUtil.resetWbs(parent, gantt.getChildren(parent.id));
		}
		// form 에 사용했던 데이터 삭제
		if(task.create)
			delete task.create;
		if(task.index)
			delete task.index;
	}

	function onGanttReady() {
		ganttOverWriteHandler.initialize();
	}
	function onLoadEnd() {
		ganttSortable.sort();
	}
	function onGridHeaderClick(name, event) {
		if(name === 'add') return false;
	}
	function onTaskClick(id, event) {
		// gantt add 버튼 클릭한 경우
		if(event.target.className === 'gantt_add') {
			// quick info box를 지운다.
			gantt.callEvent('onEmptyClick');
		}
	}
	function onTaskDblClick(id, event) {
		var task = gantt.getTask(id);
		task.index = gantt.getTaskIndex(id) + 1;
		openModal(task);
	}
	function onBeforeTaskCreated(task) {
		openModal(task);
	}
	function onBeforeTaskChanged(id, mode, task) {
		// console.log('onBeforeTaskChanged : ' + id + '/' + mode);
		return true;
	}
	function onAfterTaskUpdate(id, task) {
		/*var tasks = [];
		tasks.push(task);
		while(gantt.isTaskExists(task.parent)) {
			task = gantt.getTask(task.parent);
			tasks.push(task);
		}
		console.log('onAfterTaskUpdate : ' + tasks);*/
	}
	function onAfterTaskDrag(id, mode, event) {
		// console.log('onAfterTaskDrag : ' + mode);
	}


	return {
		initialize  : initialize
	};
}]);