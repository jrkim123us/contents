angular.module('tasks.form', [])
.controller('TaskFormController', ['$scope', '$location', '$timeout', 'task', 'taskModalHandler', function ($scope, $location, $timeout, task, taskModalHandler) {
	$scope.originalTask = task;
	$scope.task = angular.copy(task);
	$scope.dt = new Date();

	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};
	$scope.saveForm = function() {
	}
	$scope.resetForm = function() {
		angular.copy($scope.originalTask, $scope.task);
	}
	$scope.cancelForm = function() {
		taskModalHandler.closeModal();
	}
	$scope.open = function() {
		$timeout(function() {
			$scope.opened = true;
		});
	};
}]);