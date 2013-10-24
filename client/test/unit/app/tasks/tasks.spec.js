describe('tasks sync', function() {
	var $rootScope, scope, projects;

	beforeEach(module('tasks'));

	describe('TasksController', function() {
		function createLocals(path) {
			return {
				$scope: {},
				$location: {
					path: function() {return path}
				},
				Tasks: jasmine.createSpyObj('Tasks', ['get'])
			};
		}
		function runController(locals) {
			inject(function($controller) {
				$controller('TasksController', locals);
			});
		}
		it('시작 시 값은 초기화 되어야 한다.', function () {
			var locals = createLocals('/tasks/sync/');
			runController(locals);
/*			expect(locals.$scope.user.email).toBe(undefined);
			expect(locals.$scope.user.password).toBe(undefined);
			expect(locals.$scope.authError).toBe(null);
			expect(locals.$scope.authReason).toBe(null);*/
		});
	});
});