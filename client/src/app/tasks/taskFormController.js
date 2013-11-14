angular.module('tasks.form', ['ui.select2'])
.controller('TaskFormController', ['$scope', '$timeout', '$modalInstance', 'task', 'taskModalHandler', 'Tasks', 'Orgs',
	function ($scope, $timeout, $modalInstance, task, taskModalHandler, Tasks, Orgs) {
	'use strict';

	var dayTime = 24 * 60 * 60 * 1000;
	task.duration = parseInt(task.duration, 10);
	task.worker = _.unique(task.worker);
	task.approver = _.unique(task.approver);
// Scope Member Variables START
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
// Scope Member Variables End

// Scope Member Functions START
	$scope.isUnchanged = function() {
		var objList = ['wbs', 'name', 'start_date'],
			arrayList = ['worker', 'approver'],
			isUnchanged = true,
			inx, jnx, ilen, jlen, ikey, jkey;
		for(inx = 0 , ilen = objList.length ; inx < ilen ; inx++) {
			ikey = objList[inx]
			if($scope.task[ikey].toString() !== $scope.originalTask[ikey].toString()) {
				isUnchanged = false;
				break;
			}
		}

		for(inx = 0, ilen = arrayList.length ; isUnchanged && inx < ilen ; inx++) {
			jkey = arrayList[inx];
			var uniqueIds = _.unique($scope.task[jkey]), originalIds = $scope.originalTask[jkey];
			if(uniqueIds.length === $scope.originalTask[jkey].length) {
				isUnchanged = _.difference(uniqueIds, originalIds).length > 0 ? false : true;
			} else
				isUnchanged = false;
		}
		return isUnchanged;
	}
	$scope.saveForm = function() {
		var obj = $scope.task;
		if($scope.task.create) {
			console.log('create!!')
			$modalInstance.close('create');
		}
		else
			Tasks.save({
				wbs : obj.wbs,
				name : obj.name,
				startDate : obj.start_date,
				endDate : obj.end_date,
				worker : _.unique(obj.worker),
				approver : _.unique(obj.approver)
			}, function(result) {
				$modalInstance.close('save');
			})
		// $modalInstance.close('saved');
	}
	$scope.resetForm = function() {
		angular.copy($scope.originalTask, $scope.task);
		// form.$setPristine();
	}
	$scope.cancelForm = function() {
		$scope.resetForm();
		$modalInstance.dismiss('cancel');
	}
// Scope Member Functions END

// $Resource Start
	Orgs.query({}, function(result) {
		$scope.orgs = result;
	});
// $Resource End

// WATCH START
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
// WATCH END
}]);