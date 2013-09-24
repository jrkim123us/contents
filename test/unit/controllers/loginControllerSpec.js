
define([
	'angular',
    'controllers/loginController',
    'angular-mocks'
], function (angular, loginController, MockGalleryService) {
    describe('loginController', function () {
        var $scope;
        var ctrl;

        beforeEach(inject(function ($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller(loginController, {$scope: $scope, galleryService: MockGalleryService});
        }));

        // it("Should have the gallery service", function () {
        //     expect($scope.hasOwnProperty("galleryService")).toEqual(true);
        // });

        // it('Should have an uploadErrors property', function () {
        //     expect($scope.hasOwnProperty('uploadErrors')).toBe(true);
        // });

        // it("Should have have an Async Messages Property that is an array", function () {
        //     expect($scope.hasOwnProperty('asyncMessage')).toBe(true);
        // });

        // it("Should have a property of progressWidth", function () {
        //     expect($scope.hasOwnProperty("progressWidth")).toBe(true);
        // });

        // it("Should have a property of queueFileCount", function () {
        //     expect($scope.hasOwnProperty("queueFileCount")).toBe(true);
        //     expect($scope.queueFileCount).toBe(0);
        // });
});

