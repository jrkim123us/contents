angular.module('tasks.form', ['ui.select2'])
.controller('TaskFormController', ['$scope', '$modalInstance', 'task', 'taskModalHandler', 'Orgs',
	function ($scope, $modalInstance, task, taskModalHandler, Orgs) {

	var dayTime = 24 * 60 * 60 * 1000;
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
			$scope.task.start_date = $scope.originalTask.start_date;
		else {
			var end_date = new Date();
			end_date.setTime(newDate.getTime() + $scope.task.duration * dayTime);
			$scope.task.end_date = end_date;
		}
	});

	$scope.$watch('task.duration', function(duration) {
		var end_date = new Date();
		end_date.setTime($scope.task.start_date.getTime() + duration * dayTime);
		$scope.task.end_date = end_date;
	});

	$scope.saveForm = function() {
		$modalInstance.close('saved');
	}
	$scope.resetForm = function() {
		angular.copy($scope.originalTask, $scope.task);
	}
	$scope.cancelForm = function() {
		$scope.resetForm();
		$modalInstance.dismiss('cancel');
	}
}]);