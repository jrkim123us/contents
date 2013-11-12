angular.module('tasks.ganttEventsHandler', [])
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