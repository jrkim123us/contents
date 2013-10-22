describe('projects', function() {
	var $rootScope, scope, projects;

	beforeEach(module('projects'));

	describe('ProjectController', function() {
		function createLocals() {
			return {
				$scope: {},
				$location: jasmine.createSpyObj('$location', ['path'])
			};
		}
		function runController(locals) {
			inject(function($controller) {
				$controller('ProjectsController', locals);
			});
		}
		it('시작 시 값은 초기화 되어야 한다.', function () {
			var locals = createLocals();
			runController(locals);

/*			expect(locals.$scope.user.email).toBe(undefined);
			expect(locals.$scope.user.password).toBe(undefined);
			expect(locals.$scope.authError).toBe(null);
			expect(locals.$scope.authReason).toBe(null);*/
		});
	});
});