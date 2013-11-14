angular.module('app', [
	'ngRoute',
	'ngResource',
	'home',
	'tasks',
	/*'dashboard',
	'projects',
	'admin',*/
	'services.breadcrumbs',
	'services.i18nNotifications',
	'services.httpRequestTracker',
	'security',
	'directives',
	'templates.app',
	'templates.common',
	'resources'
]);

//TODO: move those messages to a separate module
angular.module('app').constant('I18N.MESSAGES', {
	/*'errors.route.changeError':'Route change error',
	'crud.user.save.success':"A user with id '{{id}}' was saved successfully.",
	'crud.user.remove.success':"A user with id '{{id}}' was removed successfully.",
	'crud.user.remove.error':"Something went wrong when removing user with id '{{id}}'.",
	'crud.user.save.error':"Something went wrong when saving a user...",
	'crud.project.save.success':"A project with id '{{id}}' was saved successfully.",
	'crud.project.remove.success':"A project with id '{{id}}' was removed successfully.",
	'crud.project.save.error':"Something went wrong when saving a project...",*/
	'login.reason.notAuthorized':"You do not have the necessary access permissions.  Do you want to login as someone else?",
	'login.reason.notAuthenticated':"You must be logged in to access this part of the application.",
	'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
	'login.error.serverError': "There was a problem with authenticating: {{exception}}."
});


angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider.otherwise({redirectTo:'/home'});
}]);

angular.module('app').run(['security', function(security) {
	// Get the current user when the application starts
	// (in case they are still logged in from a previous session)
	security.requestCurrentUser();
}]);

angular.module('app').controller('AppCtrl', ['$scope', 'i18nNotifications', 'localizedMessages', function($scope, i18nNotifications) {
	$scope.notifications = i18nNotifications;

	$scope.removeNotification = function (notification) {
		i18nNotifications.remove(notification);
	};

	$scope.$on('$routeChangeError', function(event, current, previous, rejection){
		i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
	});
}]);

angular.module('app')
.controller('HeaderCtrl', ['$scope', '$location', '$route', 'security', 'Menus', 'breadcrumbs', 'notifications', 'httpRequestTracker',
function ($scope, $location, $route, security, Menus, breadcrumbs, notifications, httpRequestTracker) {
	$scope.location = $location;
	$scope.breadcrumbs = breadcrumbs;

	$scope.isAuthenticated = security.isAuthenticated;
	$scope.isAdmin = security.isAdmin;

	$scope.$watch(function() {
		return security.currentUser;
	}, function(currentUser) {
		if(security.isAuthenticated())
			// $scope.menus = Menus.query();
			Menus.query(function(menus) {
				$scope.menus = menus;
			});
		else
			$scope.menus = {};
	});

	$scope.home = function () {
		if (security.isAuthenticated()) {
			$location.path('/home');
		} else {
			$location.path('/projectsinfo');
		}
	};

	$scope.isNavbarActive = function (navBarPath) {
		return navBarPath === breadcrumbs.getFirst().name;
	};

	$scope.hasPendingRequests = function () {
		return httpRequestTracker.hasPendingRequests();
	};

	$scope.hasChildMenus = function() {
		return true;
	};
}])
.directive('menuToolbar', function($parse, $compile) {

	var buildTemplate = function(items, level) {
		var element = '';
		angular.forEach(items, function(item, index) {
			if(item.childs.length === 0)
				element += '<li><a href="' + item.link +'" >' + item.name + '</a></li>';
			else
				switch(level) {
					case 0:
						element +='<li class="dropdown"><a href="#" data-toggle="dropdown" class="dropdown-toggle">' + item.name + '<b class="caret"></b></a>' + '<ul class="dropdown-menu">' + buildTemplate(item.childs, level + 1) + '</ul>';
						break;
					case 1:
						element += '<li class="dropdown-header">' + item.name + '</li>' + buildTemplate(item.childs, level + 1) + '<li class="divider"></li>';
						break;
					case 2:
						element += '<li><a href="{{this.link}}">' + item.name + '</a></li>';
						break;
				}
		});
		return element;
	};

	return {
		restrict: 'A',
		link: function($scope, $element, $attrs, $controller) {
			$scope.$watch('menus', function() {
				var items = $scope.menus;

				var level = 0;
				$element.html('');
				if(angular.isArray(items) && items.length > 0)
					$element.append($compile(buildTemplate(items, level))($scope));
			});
		}
	};

});
