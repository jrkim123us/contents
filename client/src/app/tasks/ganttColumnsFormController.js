angular.module('tasks.form.gantt.columns', ['frapontillo.bootstrap-switch'])
.controller('GanttColumnsFormController', ['$scope', '$modalInstance', 'columns', function ($scope, $modalInstance, columns) {
	$scope.columns = columns;
	$scope.origianlColumns = angular.copy($scope.columns);
	$scope.btnGroup = {
		sizes : [
			{type: 's', value : 'Small'},
			{type: 'm', value : 'Middle'},
			{type: 'l', value : 'Large'}
		]
	};

	/*$scope.$watch('columns.duration', function(value) {
		console.log('duration : ' + value);
	});*/

	$scope.isUnchanged = function() {
		return _.isEqual($scope.columns, $scope.origianlColumns);
	};
	$scope.save = function() {
		$modalInstance.close(['save']);
	};
	$scope.reset = function() {
		angular.copy($scope.origianlColumns, $scope.columns);
	};
	$scope.cancel = function() {
		$scope.reset();
		$modalInstance.dismiss('cancel');
	};
}]);