//'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/javascripts/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
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
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: ['lib/*.js', 'css/**/*.scss', '!lib/dontwatch.js'],
        tasks: ['default']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

  grunt.registerTask('watch', ['watch']);

};