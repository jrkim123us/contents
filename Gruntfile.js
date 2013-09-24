var files = require('./cmsFiles').files;
var util = require('./libs/grunt/utils.js');

module.exports = function(grunt) {
    // Load the plugin that provides the "uglify" task.
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks("grunt-contrib-handlebars");
    // grunt.loadNpmTasks('grunt-contrib-coffee');
    // grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadTasks('libs/grunt');

    var NG_VERSION = util.getVersion();
    var dist = 'angular-'+ NG_VERSION.full;

    // Project configuration.
    grunt.initConfig({
        NG_VERSION : NG_VERSION,
        pkg: grunt.file.readJSON('package.json'),
        // uglify: {
        //   options: {
        //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        //   },
        //   build: {
        //     src: 'public/javascripts/<%= pkg.name %>.js',
        //     dest: 'build/<%= pkg.name %>.min.js'
        //   }
        // },
        // qunit: {
        //   files: ['test/**/*.html']
        // },
        // lint: {
        //   gruntfile: {
        //     options: {
        //       jshintrc: '.jshintrc'
        //     },
        //     src: 'Gruntfile.js'
        //   },
        //   src: {
        //     options: {
        //       jshintrc: 'public/javascripts/.jshintrc'
        //     },
        //     src: ['public/javascripts/**/*.js']
        //   },
        //   test: {
        //     options: {
        //       jshintrc: 'public/javascripts/.jshintrc'
        //     },
        //     src: ['public/javascripts/**/*.js']
        //   }
        // },
        // build: {
        //     angular: {
        //         dest: 'app/libs/angular/angular.js',
        //         src: [
        //             files['angularSrc']
        //         ]
        //     },
        //     angularMin: {
        //         dest: 'app/libs/angular/angular.min.js',
        //         src: [
        //             files['angularMinSrc']
        //         ]
        //     }
        // },
        // cssmin: {
        //     'wsg3.5' : {
        //         src: 'app/libs/wsg/wsg.3.5.css',
        //         dest: 'app/libs/wsg/wsg.3.5.min.css'
        //     }
        // },
        // sass: {
        //     dist: {
        //         options: {
        //             //debugInfo: true,
        //             style: 'compressed'
        //         },
        //         files: {
        //             'public/libs/jquery.chosen/css/chosen.css': 'public/libs/jquery.chosen/sass/chosen.scss'
        //         }
        //     }
        // },
        // compass: {                  // Task
        //     dist: {                   // Target
        //         options: {              // Target options
        //             outputStyle : 'expanded',
        //             sassDir     : 'public/libs/jquery.chosen/sass',
        //             cssDir      : 'public/libs/jquery.chosen/css',

        //             imagesDir      : 'public/libs/jquery.chosen/public',
        //             httpImagesPath : '../public',

        //             environment : 'production'
        //         }
        //     }
        // },
        // coffee: {
        //     compileJoined: {
        //         options: {
        //             join: true
        //         },
        //         files: {
        //             'public/libs/jquery.chosen/js/chosen.jquery.js': ['public/libs/jquery.chosen/coffee/lib/*.coffee', 'public/libs/jquery.chosen/coffee/*.coffee']
        //         }
        //     }
        // },
        jade : {
            compile: {
                options: {
                    data: {
                        debug: false
                    }
                },
                files: {
                    "app/partials/loginForm.html": ["app/jade/loginForm.jade"]
                }
            }
        },
        copy : {
            html5shiv            : {expand: true, cwd: 'bower_components/html5shiv/dist/', src: '**', dest : 'app/libs/html5shiv/'},
            respond              : {expand: true, cwd: 'bower_components/respond/', src: ['*.js'], dest : 'app/libs/respond/'},
            requirejs            : {expand: true, cwd: 'bower_components/requirejs/', src: 'require.js', dest : 'app/libs/requirejs/'},
            'requirejs-domready' : {expand: true, cwd: 'bower_components/requirejs-domready/', src: 'domReady.js', dest : 'app/libs/requirejs/'},
            jquery               : {expand: true, cwd: 'bower_components/jquery/', src: ['jquery.js', 'jquery.min.js', 'jquery.min.map'], dest : 'app/libs/jquery/'},
            bootstrap            : {expand: true, cwd: 'bower_components/bootstrap/dist/', src: '**', dest : 'app/libs/bootstrap/'},
            'angular'            : {expand: true, cwd: 'bower_components/angular/', src: ['*.js'], dest : 'app/libs/angular/'},
            'angular-cookies'    : {expand: true, cwd: 'bower_components/angular-cookies/', src: ['*.js'], dest : 'app/libs/angular/'},
            'angular-loader'     : {expand: true, cwd: 'bower_components/angular-loader/', src: ['*.js'], dest : 'app/libs/angular/'},
            'angular-resource'   : {expand: true, cwd: 'bower_components/angular-resource/', src: ['*.js'], dest : 'app/libs/angular/'},
            'angular-sanitize'   : {expand: true, cwd: 'bower_components/angular-sanitize/', src: ['*.js'], dest : 'app/libs/angular/'},
            'angular-scenario'   : {expand: true, cwd: 'bower_components/angular-scenario/', src: ['*.js'], dest : 'test/libs/angular/'},
            'angular-mocks'      : {expand: true, cwd: 'bower_components/angular-mocks/', src: 'angular-mocks.js', dest : 'test/libs/angular/'}
        },
        watch: {
            gruntfile: {
                files: 'Gruntfile.js'
                // tasks: ['jshint:gruntfile']
            },
            src: {
                files: ['lib/*.js', 'css/**/*.scss', '!lib/dontwatch.js'],
                tasks: ['default']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            }
        },
        clean: [
            "app/libs",
            "test/libs",
            "app/partials"
        ]
    });



    // Default task(s).
    // grunt.registerTask('default', ['uglify']);
    // grunt.registerTask('default', ['handlebars']);
    grunt.registerTask('src-compile', [
        'clean',
        'coffee',
        'compass'
    ]);

    grunt.registerTask('package', [
        'bower',
        'clean',
        'jade',
        'copy'
    ]);

    grunt.registerTask('default', ['package']);

    // grunt.registerTask('watch', ['watch']);

};