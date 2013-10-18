describe('시스템 접근', function() {
	beforeEach(function() {
		browser().navigateTo('/');
	})

	function login() {
		element('ul.navbar-right button:last').click();
	}
	describe('기본 접근 및 헤더(메뉴)', function() {
		it('root URL 외에는 접근이 허용되지 않아야 한다.', function() {
			browser().navigateTo('/notUrl');
			expect(browser().location().path()).toBe("/");
		});

		it('시스템 title을 표시해야 한다.', function() {
			expect(element('title').text()).toMatch('CMS');
		});

		it('화면 상단에 메뉴를 표시해야 한다.', function() {
			expect(element('div.navbar-header a').text()).toMatch('CMS');
			expect(element('button.login').count()).toMatch(1);
		});
	});
	describe('로그인', function() {
		it('Log in 버튼 선택시 modal 화면을 제공해야 한다.', function() {
			expect(element('.modal').count()).toEqual(0);
			login();
			expect(element('.modal').count()).toEqual(1);
			expect(element('.modal-title:visible').text()).toEqual('Please sign in');
			expect(element('.form-group p:visible').count()).toEqual(0);
		});

		it('email은 필수 입력 항목이어야 한다.', function() {
			login();
			input('user.email').enter('test');
			input('user.email').enter('');
			expect(element('.form-group:first p:visible').text()).toEqual('Email is required.');
		});

		it('email은 email type 이어야  한다.', function() {
			login();
			input('user.email').enter('test');
			expect(element('.form-group:first p:visible').count()).toEqual(1);
			expect(element('.form-group:first p:visible').text()).toEqual('Please enter a valid email address.');

			input('user.email').enter('test@test.com');
			expect(element('.form-group:first p:visible').count()).toEqual(0);
		});

		it('password는 필수 입력 항목이어야 한다.', function() {
			login();
			input('user.password').enter('1234');
			input('user.password').enter('');
			expect(element('.form-group:last p:visible').text()).toEqual('Password is required.');

			input('user.password').enter('1234');
			expect(element('.form-group:last p:visible').count()).toEqual(0);
		});

		it('입력된 값의 clear 기능을 제공해야 한다.', function() {
			login();
			input('user.email').enter('test@tes.com');
			input('user.password').enter('1234');
			element('button:reset').click();

			expect(input('user.email').val()).toEqual('');
			expect(input('user.password').val()).toEqual('');
		});

		it('로그인 창 닫기 기능을 제공해야 한다.', function() {
			login();
			expect(element('.modal-footer button[type="button"]').count()).toEqual(1);
			element('.modal-footer button[type="button"]').click();

			expect(element('.modal').count()).toEqual(0);
			expect(element('.modal-title:visible').count()).toEqual(0);
		});

		it('로그인 실패 시 오류 메시지를 표시해야 한다.', function() {
			login();
			input('user.email').enter('test@tes.com');
			input('user.password').enter('1234');
			expect(element('.modal button[type="submit"]').count()).toEqual(1);
			element('.modal button[type="submit"]').click();

			expect(element('.modal-body .alert-danger:visible').count()).toEqual(1);
		});

		it('로그인 시 사용자 정보 및 logout 버튼을 제공해야 한다.', function() {
			login();
			input('user.email').enter('mike@test.com');
			input('user.password').enter('a');
			expect(element('.modal button[type="submit"]:visible').count()).toEqual(1);
			element('.modal button[type="submit"]').click();

			expect(element('.modal').count()).toEqual(0);
			expect(element('button.logout').count()).toEqual(1);
			expect(binding('currentUser.firstName')).toEqual('Mike');
			expect(binding('currentUser.lastName')).toEqual('Lee');

		});
	});

});