angular.module('tasks.form', ['ui.select2'])
.controller('TaskFormController', ['$scope', '$location', '$timeout', 'task', 'taskModalHandler', 'Orgs',
	function ($scope, $location, $timeout, task, taskModalHandler, Orgs) {
	$scope.originalTask = task;
	$scope.task = angular.copy(task);
	$scope.dt = new Date();

	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};

	$scope.select2Options = {
		allowClear  : true,
		// multiple    : true,
		placeholder : '담당자를 선택하세요'
		// minimumInputLength : 1
	}
	Orgs.query({}, function(result) {
		$scope.orgs = result;
	});

	$scope.saveForm = function() {
	}
	$scope.resetForm = function() {
		angular.copy($scope.originalTask, $scope.task);
	}
	$scope.cancelForm = function() {
		taskModalHandler.closeModal();
	}
}]);