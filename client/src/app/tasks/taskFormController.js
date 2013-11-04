angular.module('tasks.form', [])
.controller('TaskFormController', ['$scope', '$location', 'task', function ($scope, $location, task) {
	$scope.task = task;
	console.log(task);
}]);