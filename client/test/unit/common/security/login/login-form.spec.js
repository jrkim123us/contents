describe('login', function() {
	var $rootScope, scope, login, security;
	beforeEach(function() {
		angular.module('I18N-mock', []).value('I18N.MESSAGES', {});
	});
	beforeEach(module('I18N-mock', 'security.login.form'));

	describe('LoginFormController', function() {
		function createLocals() {
			return {
				$scope: {},
				$location: jasmine.createSpyObj('$location', ['path']),
				security: jasmine.createSpyObj('security', ['getLoginReason', 'cancelLogin'])
			};
		}
		function runController(locals) {
			inject(function($controller) {
				$controller('LoginFormController', locals);
			});
		}
		it('시작 시 값은 초기화 되어야 한다.', function () {
			// debugger;

			var locals = createLocals();
			runController(locals);

			expect(locals.$scope.user.email).toBe(undefined);
			expect(locals.$scope.user.password).toBe(undefined);
			expect(locals.$scope.authError).toBe(null);
			expect(locals.$scope.authReason).toBe(null);
		});

		it('clearForm을 통해 user 정보는 초기화 되어야 한다.', function() {
			var locals = createLocals();
			runController(locals);

			locals.$scope.user = {
				email : 'test@test.com',
				password : '1234'
			};
			locals.$scope.clearForm();

			expect(locals.$scope.user.email).toBe(undefined);
			expect(locals.$scope.user.password).toBe(undefined);
		});

		it('Cancel 호출 시 security의 cancelLogin을 호출해야 한다.', function() {
			var locals = createLocals();
			runController(locals);

			// debugger;
			locals.$scope.cancelLogin();
			expect(locals.security.cancelLogin).toHaveBeenCalled();
		});
	});
});