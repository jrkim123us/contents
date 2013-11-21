angular.module('tasks.ganttEventsHandler', [])
.factory('ganttEventsHandler', ['ganttSortable', 'ganttOverWriteHandler', 'taskModalHandler', 'GanttDnD',
	function(ganttSortable, ganttOverWriteHandler, taskModalHandler, GanttDnD) {
	var taskModal;
	var dragStart = null;
	var ganttEvents = {
		'onGanttReady'        : onGanttReady,
		'onLoadEnd'           : onLoadEnd,
		'onTaskClick'         : onTaskClick,
		'onTaskDblClick'      : onTaskDblClick,
		'onGridHeaderClick'   : onGridHeaderClick,
		'onBeforeTaskCreated' : onBeforeTaskCreated,
		'onBeforeTaskChanged' : onBeforeTaskChanged,
		'onAfterTaskUpdate'   : onAfterTaskUpdate,
		'onAfterTaskDrag'     : onAfterTaskDrag,
		// Dragging tasks only within the parent branch
		'onRowAfterDragStart' : onRowAfterDragStart,
		'onRowDragEnd'        : onRowDragEnd
	};
	function initialize() {
		angular.forEach(ganttEvents, function(evFn, evName){
			gantt.attachEvent(evName, evFn);
		});
	}
	function openModal(task) {
		var originalTask = angular.copy(task);
		taskModal = taskModalHandler.openModal(task);

		taskModal.result
			.then(function(args) { // save 버튼으로 닫힌 경우
				if(args.length > 1 ) {
					processTaskOnGantt(args[0], args[1]);
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
				gantt.render();
			});
	}

	function processTaskOnGantt(type, task) {
		if(type === 'create') {
			gantt.addTask(task);
			gantt.showTask(task.id);
		} else if (type === 'delete') {
			gantt.deleteTask(task.id);
		}
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
		openModal(gantt.getTask(id));
	}
	function onBeforeTaskCreated(task) {
		openModal(task);
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
		console.log('onAfterTaskDrag : ' + mode);
	}
// Grid 영역 Drag & Drop 처리 이벤트
	function onRowAfterDragStart(taskId, event) {
		dragStart = {};
		setDragInfo(dragStart, taskId);
	}
	function onRowDragEnd(movedId, nextId) {
		var params = {};
// back-end 영역 처리
		beforeUpdateServer(params, movedId);

		console.log(params);

		/*GanttDnD.save(params, function(result) {
			// front-end 영역 처리
			// onAfterUpdateServer(params.wbs);
		});*/
	}
	function beforeUpdateServer(params, movedId) {
		var isDownward = true,
			isChangeParent = false;

		var dragEnd = {};
		setDragInfo(dragEnd, movedId);
		params.moved = {
			id : movedId,
			index : dragEnd.index
		};
		// 부모가 바뀌었는지
		if(dragStart.parent.id !== dragEnd.parent.id) {
			params.isChangeParent = true;
			params.shift = [{
				parent : {
					id : dragStart.parent.id,
					wbs : dragStart.parent.wbs
				},
				start : dragStart.index + 1,
				inc : -1
			}, {
				parent : {
					id : dragEnd.parent.id,
					wbs : dragEnd.parent.wbs
				},
				start : dragEnd.index,
				inc : 1
			}];
		}
		else {
			params.parent = {
				id : dragStart.parent.id,
				wbs : dragStart.parent.wbs
			};
			if(dragStart.index === dragEnd.index)
				return;
			else if(dragStart.index < dragEnd.index) {
				params.isDownward = true;
				params.shift = {
					start : dragStart.index + 1,
					end : dragEnd.index,
					inc : -1
				};
			} else {
				params.shift = {
					start : dragEnd.index,
					end : dragStart.index - 1,
					inx : 1
				};
			}
		}


		/*if(dragStart.index === dragEnd.index)
			return;
		if(dragStart.index > dragEnd.index)
			isDownward = false;
		if(dragStart.parent.id !== dragEnd.parent.id) {
			isChangeParent = true;
			// 주의 : dragStart의 children은 이동 후 변경된 항목을 가져와야 함
			dragStart.childrenIds = gantt.getChildren(dragStart.parent.id);
		}
		dragEnd.childrenIds = gantt.getChildren(dragEnd.parent.id);
		// task_id 용
		params.taskId = {
			isDownward : isDownward,
			movedId    : movedId,
			start      : isDownward ? dragStart.next : dragEnd.next,
			end        : isDownward ? dragEnd.prev : dragStart.prev
		};
		// wbs 용
		params.wbs = {
			isChangeParent : isChangeParent,
			dragStart : {
				parent: {id : dragStart.parent.id, wbs : dragStart.parent.wbs },
				childrenIds : dragStart.childrenIds
			},
			dragEnd : {
				moved : {id : movedId, wbs : dragEnd.wbs},
				parent: {id : dragEnd.parent.id, wbs : dragEnd.parent.wbs },
				childrenIds : dragEnd.childrenIds
			}
		};*/
	}
	function onAfterUpdateServer(params) {
		// front-end 영역 처리
		if(params.isChangeParent)
			resetWbs(params.dragStart.parent, params.dragStart.childrenIds);

		resetWbs(params.dragEnd.parent, params.dragEnd.childrenIds);

		gantt.refreshData();

		dragStart = null;
	}
	function setDragInfo(info, taskId) {
		var task = gantt.getTask(taskId);

		// info.wbs = task.wbs;
		info.index  = gantt.getTaskIndex(taskId) + 1;
		info.parent = gantt.getTask(task.parent);
		/*info.prev   = gantt.getPrev(task.id);
		info.next   = gantt.getNext(task.id);*/
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
		initialize  : initialize
	};
}]);