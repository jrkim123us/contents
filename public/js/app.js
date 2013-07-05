// Filename: app.js
define([
    'app/router',
    'backbone'
    // 'i18next'
], function(Router){
    var initialize = function(config){
        // loadLocalizationFromI18n(config);
        // Pass in our Router module and call it's initialize function
        return Router.initialize(config);
    };

    // var loadLocalizationFromI18n = function(config) {
    //   // 다국어 데이터 로드
    //   var i18nLng = config.i18nLng || 'ko';
    //   $.i18n.init({
    //     ns: { namespaces: ['label', 'msg', 'code'], defaultNs: 'label'},
    //     lng         : i18nLng,
    //     resGetPath  : '/pbf/system/locales/retrieveMsgList.pson?locales=__lng__&namespace=__ns__',
    //     fallbackLng : i18nLng,
    //     getAsync : false,
    //     nsseparator: '::',
    //     keyseparator: '..'
    //   });

    // };

    return {
        initialize: initialize
    };
});
