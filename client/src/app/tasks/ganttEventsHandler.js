angular.module('tasks.ganttEventsHandler', [])
.factory('ganttEventsHandler', ['ganttSortable', 'ganttOverWriteHandler', 'taskModalHandler',
	function(ganttSortable, ganttOverWriteHandler, taskModalHandler) {
	var taskModal;
	var ganttEvents = {
		'onGanttReady'        : onGanttReady,
		'onLoadEnd'           : onLoadEnd,
		'onTaskClick'         : onTaskClick,
		'onTaskDblClick'      : onTaskDblClick,
		'onBeforeTaskCreated' : onBeforeTaskCreated,
		'onBeforeTaskChanged' : onBeforeTaskChanged,
		'onAfterTaskUpdate'   : onAfterTaskUpdate,
		'onAfterTaskDrag'     : onAfterTaskDrag
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
		// console.log('onAfterTaskDrag : ' + mode);
	}

	return {
		initialize  : initialize
	};
}]);