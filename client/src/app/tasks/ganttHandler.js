angular.module('tasks.ganttHandler', [])
.factory('ganttHandler', ['ganttOptions', 'ganttEventsHandler', 'ganttColumnsModalHandler',
	function(ganttOptions, ganttEventsHandler, columnsHandler) {

	// TO-DO : ganttHandler와 modal handler 분리 필요함 TaskController 에서 사용 대비
	function initialize(element, type, columns) {
		ganttOptions.initialize(type, columns);

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

	function render(type, columns) {
		ganttOptions.initialize(type, columns);

		gantt.render();
	}

	function setQuickInfoEnable(enable) {
		ganttOptions.setQuickInfoEnable(enable);
	}

	function setGanttColumns(columns) {
		var columnsModal = columnsHandler.openModal(columns);

		columnsModal.result
			.then(function(args) { // save 버튼으로 닫힌 경우
				ganttOptions.initialize(null, columns);
			})
			.catch(function(reason) { // cancel 버튼 등 reject 경우
				// console.log('closed unexpected');
				if(reason === "backdrop click") {
					console.log('To-Do: closed unexpected');
					// task 변경 전으로 수정해야 함
				}
			})
			.finally(function() { // 무조건 실행
				gantt.render(); // 헤더까지 바뀌어야 됨으로, 전체 refresh
			});
	}

	function attachEvents() {
		ganttEventsHandler.initialize();
	}
	return {
		initialize         : initialize,
		parse              : parse,
		render             : render,
		setQuickInfoEnable : setQuickInfoEnable,
		setGanttColumns    : setGanttColumns
	};
}]);