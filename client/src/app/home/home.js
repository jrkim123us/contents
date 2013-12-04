angular.module('home', [])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl:'home/home.tpl.html',
		controller:'HomeController'
	});
}])

.controller('HomeController', ['$scope', '$location', function ($scope, $location) {
	$scope.slideInterval = 10000;
	$scope.slides = [
		{
			image: '/static/img/slide-01.jpg',
			title : 'Catch phrase',
			text : 'ead Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.',
			active: true
		},
		{
			image: '/static/img/slide-02.jpg',
			title : 'Catch phrase',
			text : 'ead Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'
		},
		{
			image: '/static/img/slide-03.jpg',
			title : 'Catch phrase',
			text : 'ead Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'
		}
	];
}]);