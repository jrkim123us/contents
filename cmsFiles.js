cmsFiles = {
  'angularSrc': [
    'bower_components/angular/angular.js',
    'bower_components/angular-cookies/angular-cookies.js',
    'bower_components/angular-loader/angular-loader.js',
    'bower_components/angular-resource/angular-resource.js',
    'bower_components/angular-santize/angular-santize.js'
  ],

  'angularMinSrc': [
    'bower_components/angular/angular.min.js',
    'bower_components/angular-cookies/angular-cookies.min.js',
    'bower_components/angular-loader/angular-loader.min.js',
    'bower_components/angular-resource/angular-resource.min.js',
    'bower_components/angular-santize/angular-santize.min.js'
  ],
  'wsg3.5' : [
    'bower_components/wsg/3.5/css/kit_base.css',
    'bower_components/wsg/3.5/css/kit_global_style.css',
    'bower_components/wsg/3.5/css/kit_global_layout.css',
    'bower_components/wsg/3.5/css/kit_page_style.css',
    'bower_components/wsg/3.5/css/kit_page_layout.css',
    'bower_components/wsg/3.5/css/kit_helpOn.css',
    'bower_components/wsg/3.5/css/kit_totalSearch.css',
    'bower_components/wsg/3.5/css/kit_comp_calendar.css',
    'bower_components/wsg/3.5/css/kit_comp_info.css',
    'bower_components/wsg/3.5/css/kit_dui_calendar.css',
    'bower_components/wsg/3.5/css/kit_login.css',
    'bower_components/wsg/3.5/css/KITTree.css',
    'bower_components/wsg/3.5/css/kit_openQNA.css',
    'bower_components/wsg/3.5/css/kit_commNavi.css'
  ],
  'wsg4.0' : [
    'bower_components/wsg/4.0/css/wsg_base.css',
    'bower_components/wsg/4.0/css/wsg_global_style.css',
    'bower_components/wsg/4.0/css/wsg_global_layout.css',
    'bower_components/wsg/4.0/css/wsg_page_style.css',
    'bower_components/wsg/4.0/css/wsg_page_layout.css',
    'bower_components/wsg/4.0/css/wsg_commNavi.css',
    'bower_components/wsg/4.0/css/wsg_helpOn.css',
    'bower_components/wsg/4.0/css/wsg_totalSearch.css',
    'bower_components/wsg/4.0/css/wsg_comp_calendar.css',
    'bower_components/wsg/4.0/css/wsg_comp_info.css',
    'bower_components/wsg/4.0/css/wsg_dui_calendar.css',
    'bower_components/wsg/4.0/css/wsg_login.css',
    'bower_components/wsg/4.0/css/KITTree.css',
    'bower_components/wsg/4.0/css/wsg_openQNA.css',
    'bower_components/wsg/4.0/css/wsg_comp_calendar2.css',
  ],
  'wsg4.1' : [
    'bower_components/wsg/4.1/css/wsg_webaccess.css',
    'bower_components/wsg/4.1/css/wsg_base.css',
    'bower_components/wsg/4.1/css/wsg_global_style.css',
    'bower_components/wsg/4.1/css/wsg_global_layout.css',
    'bower_components/wsg/4.1/css/wsg_page_style.css',
    'bower_components/wsg/4.1/css/wsg_page_layout.css',
    'bower_components/wsg/4.1/css/wsg_commNavi.css',
    'bower_components/wsg/4.1/css/wsg_helpOn.css',
    'bower_components/wsg/4.1/css/wsg_totalSearch.css',
    'bower_components/wsg/4.1/css/wsg_comp_calendar.css',
    'bower_components/wsg/4.1/css/wsg_comp_calendar2.css',
    'bower_components/wsg/4.1/css/wsg_comp_info.css',
    'bower_components/wsg/4.1/css/wsg_dui_calendar.css',
    'bower_components/wsg/4.1/css/wsg_login.css',
    'bower_components/wsg/4.1/css/KITTree.css',
    'bower_components/wsg/4.1/css/wsg_openQNA.css'
  ],

  'karma': [
    'bower_components/jquery/jquery.js',
    'test/jquery_remove.js',
    '@angularSrc',
    'src/publishExternalApis.js',
    '@angularSrcModules',
    '@angularScenario',
    '@angularTest',
    'example/personalLog/*.js',
    'example/personalLog/test/*.js'
  ]
};

if (exports) {
  exports.files = cmsFiles;
  exports.mergeFilesFor = function() {
    var files = [];

    Array.prototype.slice.call(arguments, 0).forEach(function(filegroup) {
      cmsFiles[filegroup].forEach(function(file) {
        // replace @ref
        var match = file.match(/^\@(.*)/);
        if (match) {
          files = files.concat(angularFiles[match[1]]);
        } else {
          files.push(file);
        }
      });
    });

    return files;
  };
}
