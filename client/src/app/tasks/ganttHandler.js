angular.module('tasks.ganttHandler', [])
.factory('ganttHandler', ['ganttOptions', 'ganttEventsHandler',
	function(ganttOptions, ganttEventsHandler) {

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

	function setQuickInfoEnable(enable) {
		ganttOptions.setQuickInfoEnable(enable);
	}
	function attachEvents() {
		ganttEventsHandler.initialize();
	}
	return {
		initialize      : initialize,
		parse           : parse,
		render          : render,
		setQuickInfoEnable : setQuickInfoEnable
	};
}])