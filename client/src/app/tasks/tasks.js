angular.module('tasks', [
	'services.crud',
	'ui.bootstrap',
	'tasks.task',
	'tasks.gantt'
])
.factory('taskModalHandler', ['$modal', function($modal) {
	// Task Model 처리 영역 START
	function openModal(task) {
		taskModal = $modal.open( {
			templateUrl : 'tasks/taskForm.tpl.html',
			controller  :  'TaskFormController',
			resolve : {
				task : function() {
					return task;
				}
			}
			/*backdrop    : false,
			keyboard    : false*/
		});
	}
	function closeModal(success) {
		if(taskModal)
			taskModal.close(success);
	}
	// Task Model 처리 영역 END

	return {
		openModal : openModal,
		closeModal : closeModal
	}
}]);
