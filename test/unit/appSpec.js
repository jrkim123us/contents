/*define([
    'angular',
    'app'
], function (angular, app) {
    describe("Module App : ", function() {
        beforeEach(function(){});

        it("등록되어 있어야 한다.", function() {
            expect(app).not.toBe(null);
        });

        describe("Dependencies:", function() {
            var deps;
            var hasModule = function(m) {
                return deps.indexOf(m) >= 0;
            };
            beforeEach(function() {
                deps = app.value('appName').requires;
            });

            //you can also test the module's dependencies
            it("ngResource 를 사용하지 않는다.", function() {
                expect(hasModule('ngResource')).toBe(false);
            });
        });
    });
});*/