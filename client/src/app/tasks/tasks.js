angular.module('tasks', [
	'services.crud',
	'ui.bootstrap',
	'tasks.task',
	'tasks.gantt'
])
.factory('taskModalHandler', ['$modal', function($modal) {
	// Task Model 처리 영역 START
	var taskModal;
	function openModal(task) {
		taskModal = $modal.open( {
			templateUrl : 'tasks/taskForm.tpl.html',
			controller  :  'TaskFormController',
			// controller에 데이터 전달
			resolve : {
				task : function() {
					return task;
				}
			}
			/*backdrop    : false,
			keyboard    : false*/
		});

		return taskModal;
	}
	// Task Model 처리 영역 END

	return {
		openModal : openModal
	}
}]);
