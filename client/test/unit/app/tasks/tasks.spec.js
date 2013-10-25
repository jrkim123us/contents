describe('tasks sync', function() {
	// var $rootScope, scope, projects;
	// inject(function($rootScope, $controller, $httpBackend) {});

	beforeEach(module('tasks'));

	describe('TasksController', function() {
		var location, rootScope, scope, ctrl, Tasks,
			wbs = '1.2',
			path =  '/tasks/sync/' + wbs;

		beforeEach(inject(function($rootScope, $location, $routeParams, $controller) {
			location = $location;
			location.path(path);
			$routeParams.wbs = wbs;
			Tasks = jasmine.createSpyObj('Tasks', ['get']);

			rootScope = $rootScope;

			scope = $rootScope.$new();
			ctrl = $controller('TasksController', {
				$scope: scope,
				$routeParams : $routeParams,
				Tasks: Tasks
			});
		}));


		it('path를 기준으로 wbs 값을 초기화 해야 한다.', function() {
			expect(location.path()).toBe(path);
			expect(scope.currentWbs).toBe(wbs);
		});

		it('wbs 기준으로 Task 정보를 조회 해야 한다.', function() {
			scope.getTask();
			expect(Tasks.get).toHaveBeenCalled();
		});

		it('wbs sorting을 위한 custome function을 제공해야 한다.', function() {
			var task = {};
			task.wbs = '1.2';
			expect(scope.sortWbs(task)).toBe(201);
			task.wbs = '1.3.4';
			expect(scope.sortWbs(task)).toBe(40301);
		});

		it('breadcrumb 구성을 위한 wbs parents array를 제공해야 한다.', function() {
			// ToDo : private 함수를 별도의 factory or privider로 구성할 지 .
			/*var wbs = '1';
			expect(scope.getParentsWbs(wbs).length).toBe(0);
			wbs = '1.3.1';
			expect(scope.getParentsWbs(wbs).length).toBe(2);
			wbs = '1.3.5.2.1';
			expect(scope.getParentsWbs(wbs).length).toBe(4);*/
		});
	});
});