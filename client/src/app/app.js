angular.module('app', [
	'ngRoute',
	'ngResource',
	'projectsinfo',
	/*'dashboard',
	'projects',
	'admin',*/
	'services.breadcrumbs',
	'services.i18nNotifications',
	'services.httpRequestTracker',
	'security',
	/*'directives.crud',*/
	'templates.app',
	'templates.common',
	'resources.menus'
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
	$routeProvider.otherwise({redirectTo:'/'});
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

	$scope.menus = Menus.query();

	$scope.home = function () {
		if (security.isAuthenticated()) {
			$location.path('/dashboard');
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
.directive('menuToolbar', function($parse, $compile, $timeout) {

  var buildTemplate = function(items, ul) {
    if(!ul) ul = ['<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">', '</ul>'];
    angular.forEach(items, function(item, index) {
      if(item.divider) return ul.splice(index + 1, 0, '<li class="divider"></li>');
      var li = '<li' + (item.submenu && item.submenu.length ? ' class="dropdown-submenu"' : '') + '>' +
        '<a tabindex="-1" ng-href="' + (item.href || '') + '"' + (item.click ? '" ng-click="' + item.click + '"' : '') + (item.target ? '" target="' + item.target + '"' : '') + (item.method ? '" data-method="' + item.method + '"' : '') + '>' +
        (item.icon && '<i class="' + item.icon + '"></i>&nbsp;' || '') +
        (item.text || '') + '</a>';
      if(item.submenu && item.submenu.length) li += buildTemplate(item.submenu).join('\n');
      li += '</li>';
      ul.splice(index + 1, 0, li);
    });
    return ul;
  };

  return {
    restrict: 'EA',
    scope: true,
    link: function postLink(scope, iElement, iAttrs) {

      var getter = $parse(iAttrs.bsDropdown),
          items = getter(scope);

      // Defer after any ngRepeat rendering
      $timeout(function() {

        if(!angular.isArray(items)) {
          // @todo?
        }

        var dropdown = angular.element(buildTemplate(items).join(''));
        // dropdown.insertAfter(iElement);
        iElement.append(dropdown);

        // Compile dropdown-menu
        $compile(iElement.next('ul.dropdown-menu'))(scope);

      });

      iElement
        .addClass('dropdown-toggle')
        .attr('data-toggle', 'dropdown');

    }
  };

});
