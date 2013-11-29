angular.module('tasks.ganttHandler', [])
.factory('ganttHandler', ['ganttOptions', 'ganttEventsHandler',
	function(ganttOptions, ganttEventsHandler) {

	// TO-DO : ganttHandler와 modal handler 분리 필요함 TaskController 에서 사용 대비
	function initialize(element, type) {
		ganttOptions.initialize(type);

		attachEvents();

		element.dhx_gantt({});
	}
	function parse(data) {
		predefineData(data.data);

		ganttOptions.setUserData(data);
		gantt.clearAll();
		gantt.parse(data);
	}

	function predefineData(data) {
		// 중간 레벨 Task 기준으로 조회할 경우 지원
		// 두번째 레벨이 보이게 설정
		if(data.length > 0 ) {
			if(data[0].parent) {
				data[0].realParent = data[0].parent;
				delete data[0].parent;
			}
			data[0].open = true;
		}
	}

	function render(type) {
		ganttOptions.initialize(type);

		gantt.render();
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
}]);