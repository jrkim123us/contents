angular.module('tasks.form', ['ui.select2'])
.controller('TaskFormController', ['$scope', '$timeout', '$modalInstance', 'task', 'taskModalHandler', 'Tasks', 'Orgs',
	function ($scope, $timeout, $modalInstance, task, taskModalHandler, Tasks, Orgs) {
	'use strict';

	var dayTime;
	initailize();

	function initailize() {
		dayTime = (24 * 60 * 60 * 1000) - 1000;
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
		};
	// Scope Member Variables End
	// $Resource Start
		Orgs.query({}, function(result) {
			$scope.orgs = result;
		});
	// $Resource End
	}

// Scope Member Functions START
	$scope.isUnchanged = function() {
		//_.isEqual() 을 사용해서 비교하려 했으나, 동일한 값의 array의 순서가 다르면
		// false로 판단하기 때문에 별도 구현.
		var isUnchanged = true, inx, ilen, key,
			objKeys = ['wbs', 'name', 'start_date', 'duration', 'desc'],
			arrayKeys = ['worker', 'approver'],
			formTask = _.pick($scope.task, objKeys),
			originalTask = _.pick($scope.originalTask, objKeys),
			changedIds, originalIds;
		// variable 비교
		isUnchanged = !$scope.task.create && _.isEqual(formTask, originalTask);
		// array 비교
		for(inx = 0, ilen = arrayKeys.length ; isUnchanged && inx < ilen ; inx++) {
			key = arrayKeys[inx];

			changedIds= _.unique($scope.task[key]);
			originalIds = $scope.originalTask[key];

			if(changedIds.length === originalIds.length)
				isUnchanged = _.difference(changedIds, originalIds).length > 0 ? false : true;
			else
				isUnchanged = false;
		}

		return isUnchanged;
	};
	$scope.save = function() {
		var keys = ['id', 'wbs', 'name', 'desc', 'parent', 'leaf', 'duration'],
			obj = _.pick($scope.task, keys);
		// gantt 와 db의 schema 가 다름
		obj.startDate = $scope.task.start_date;
		// startDate와 duration으로 서버단에서 endDate를 계산한다.

		obj.worker = _.unique($scope.task.worker);
		obj.approver = _.unique($scope.task.approver);

		if($scope.task.create) {
			// index 정보 생성 위치 ganttOverWriteHandler
			obj.index = $scope.task.index;
			Tasks.create(obj, function(result) {
				$scope.task.id = result.id;
				$modalInstance.close(['create', $scope.task]);
			});
		}
		else {
			Tasks.save(obj, function(result) {
				console.log('status : ' + result.status);
				$modalInstance.close(['save']);
			});
		}
	};
	$scope.delete = function() {
		var keys = ['id', 'wbs', 'parent', 'index'],
			obj = _.pick($scope.task, keys);
		Tasks.delete(obj, function(result) {
			$modalInstance.close(['delete', $scope.task]);
		});
	};
	$scope.reset = function() {
		angular.copy($scope.originalTask, $scope.task);
		// form.$setPristine();
	};
	$scope.cancel = function() {
		$scope.reset();
		$modalInstance.dismiss('cancel');
	};
// Scope Member Functions END

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