angular.module('tasks.form', ['ui.select2'])
.controller('TaskFormController', ['$scope', '$location', '$timeout', 'task', 'taskModalHandler', 'Orgs',
	function ($scope, $location, $timeout, task, taskModalHandler, Orgs) {
	task.duration = parseInt(task.duration, 10);
	$scope.originalTask = angular.copy(task);
	$scope.task         = task;
	$scope.dt           = new Date();

	$scope.dateOptions = {
		'year-format'  : "'yy'",
		'starting-day' : 1
	};

	$scope.select2Options = {
		allowClear  : true,
		placeholder : '담당자를 선택하세요'
		// minimumInputLength : 1
	}
	Orgs.query({}, function(result) {
		$scope.orgs = result;
	});
	$scope.$watch('task.start_date', function(newDate, oldDate) {
		if(!newDate)
			$timeout(function() {
				$scope.task.start_date = $scope.originalTask.start_date;
			});
		$scope.task.end_date = new Date().setTime(newDate.getTime() + $scope.task.duration * 24 * 60 * 60 * 1000);
	});

	$scope.$watch('task.duration', function(duration) {
		$scope.task.end_date = new Date().setTime($scope.task.start_date.getTime() + duration * 24 * 60 * 60 * 1000);
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