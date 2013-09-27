
define([
    'angular',
    'angular-mocks',
    'app'
], function (angular, mocks, app) {
    'use strict';

    describe('UNIT : loginController', function () {
        var LoginController, $scope;

        beforeEach(function() {
            mocks.module('App');
            mocks.inject(function($rootScope, $controller){
                $scope = $rootScope.$new();
                LoginController = $controller('LoginController', {
                    $scope : $scope
                });
            })
            console.log(LoginController);
        });
        /*var App;
        beforeEach(function() {
            App = angular.mock.module('App', []);
        });*/
/*        beforeEach(module('App'));

        // inject() is used to inject arguments of all given functions
        it('should provide a version', inject(function(mode, version) {
            expect(version).toEqual('v1.0.1');
            expect(mode).toEqual('app');
        }));*/


        it('등록되어 있어야 한다.', function() {
            expect(LoginController).not.toBe(null);
            // expect(App.loginCtroller).not.toBe(null);
        });

/*        it('ID는 이메일이어야 한다.', inject(function($rootScope, $controller, $httpBackend) {
            var $scope = $rootScope.$new();
            console.log($controller);
            var ctrl = $controller('LoginController', {
                $scope: $scope
            })
        }));*/
    });

});

/*angular.module('myApplicationModule', [])
       .value('mode', 'app')
       .value('version', 'v1.0.1');


   describe('MyApp', function() {

     // You need to load modules that you want to test,
     // it loads only the "ng" module by default.
     beforeEach(module('myApplicationModule'));


     // inject() is used to inject arguments of all given functions
     it('should provide a version', inject(function(mode, version) {
       expect(version).toEqual('v1.0.1');
       expect(mode).toEqual('app');
     }));


     // The inject and module method can also be used inside of the it or beforeEach
     it('should override a version and test the new version is injected', function() {
       // module() takes functions or strings (module aliases)
       module(function($provide) {
         $provide.value('version', 'overridden'); // override version here
       });

       inject(function(version) {
         expect(version).toEqual('overridden');
       });
     ));
   });*/