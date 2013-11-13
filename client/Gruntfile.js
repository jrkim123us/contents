module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-html2js');

	// Default task.
	grunt.registerTask('default', ['jshint','build','karma:unit']);
	grunt.registerTask('build', ['clean','html2js', 'recess:build', 'concat','copy']);
	grunt.registerTask('release', ['clean','html2js','uglify','jshint','karma:unit','concat:index', 'recess:min','copy']);
	grunt.registerTask('test-watch', ['karma:watch']);

	// Print a timestamp (useful for when watching)
	grunt.registerTask('timestamp', function() {
		grunt.log.subhead(Date());
	});

	var karmaConfig = function(configFile, customOptions) {
		var options = { configFile: configFile, keepalive: true };
		var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
		return grunt.util._.extend(options, customOptions, travisOptions);
	};

	// Project configuration.
	// 테스트는
	grunt.initConfig({
		distdir: 'dist',
		vendorDir: 'bower_components',
		testVendorDir: 'test/vendor',
		pkg: grunt.file.readJSON('package.json'),
		banner:
			'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
			' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
		src: {
			js: ['src/**/*.js', '<%= distdir %>/templates/**/*.js'],
			specs: ['test/**/*.spec.js'],
			scenarios: ['test/**/*.scenario.js'],
			html: ['src/index.html'],
			tpl: {
					app: ['src/app/**/*.tpl.html'],
					common: ['src/common/**/*.tpl.html']
			},
			less: ['src/less/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
			lessWatch: ['src/less/**/*.less']
		},
		// clean: ['<%= distdir %>/*', '<%= testVendorDir %>/*'],
		clean: ['<%= distdir %>/*'],
		copy: {
			assets: {
				files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
			},
			bootstrapFont: {
				files: [{ dest: '<%= distdir %>/fonts', src : '**', expand: true, cwd: '<%= vendorDir %>/bootstrap/fonts' }]
			},
			select2 : {
				files: [
					{dest: '<%= distdir %>/img/select2/select2.png', src : '<%= vendorDir %>/select2/select2.png'},
					{dest: '<%= distdir %>/img/select2/select2-spinner.gif', src : '<%= vendorDir %>/select2/select2-spinner.gif'}
				]
			}
		},
		karma: {
			unit: { options: karmaConfig('test/config/unit.js') },
			e2e: { options: karmaConfig('test/config/e2e.js') },
			watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
		},
		html2js: {
			app: {
				options: {
					base: 'src/app'
				},
				src: ['<%= src.tpl.app %>'],
				dest: '<%= distdir %>/templates/app.js',
				module: 'templates.app'
			},
			common: {
				options: {
					base: 'src/common'
				},
				src: ['<%= src.tpl.common %>'],
				dest: '<%= distdir %>/templates/common.js',
				module: 'templates.common'
			}
		},
		concat:{
			dist:{
				options: {
					banner: "<%= banner %>"
				},
				src:['<%= src.js %>'],
				dest:'<%= distdir %>/<%= pkg.name %>.js'
			},
			index: {
				src: ['src/index.jade'],
				dest: '<%= distdir %>/index.jade',
				options: {
					process: true
				}
			},
			login: {
				src: ['src/login.jade'],
				dest: '<%= distdir %>/login.jade',
				options: {
					process: true
				}
			},
			angular: {
				src  : [
					'<%= vendorDir %>/angular/angular.js',
					'<%= vendorDir %>/angular-route/angular-route.js',
					'<%= vendorDir %>/angular-resource/angular-resource.js'
				],
				dest : '<%= distdir %>/angular.js'
			},
			angularMock : {
				src: ['<%= vendorDir %>/angular-mocks/angular-mocks.js'],
				dest : '<%= testVendorDir%>/angular/angular-mocks.js'
			},
			angularScenario : {
				src: ['<%= vendorDir %>/angular-scenario/angular-scenario.js'],
				dest : '<%= testVendorDir%>/angular/angular-scenario.js'
			},
			bootstrap: {
				src:[
					'<%= vendorDir %>/angular-bootstrap/ui-bootstrap-tpls-0.6.0-SNAPSHOT.js',
					'<%= vendorDir %>/angular-ui-sortable/src/sortable.js',
					'<%= vendorDir %>/angular-ui-select2/src/select2.js',
					'<%= vendorDir %>/angular-bootstrap-switch/dist/angular-bootstrap-switch.js'
				],
				dest: '<%= distdir %>/bootstrap.js'
			},
			jquery: {
				src:[
					'<%= vendorDir %>/jquery/jquery.js',
					'<%= vendorDir %>/jquery-ui/ui/jquery.ui.core.js',
					'<%= vendorDir %>/jquery-ui/ui/jquery.ui.widget.js',
					'<%= vendorDir %>/jquery-ui/ui/jquery.ui.mouse.js',
					'<%= vendorDir %>/jquery-ui/ui/jquery.ui.sortable.js',
					'<%= vendorDir %>/select2/select2.js',
					'<%= vendorDir %>/bootstrap-switch/static/js/bootstrap-switch.js'
				],
				dest: '<%= distdir %>/jquery.js'
			},
			dhtmlx: {
				src: [
					'<%= vendorDir %>/dhtmlx/dhtmlxgantt.js',
					// '<%= vendorDir %>/dhtmlx/dhtmlxgantt_tooltip.js',
					'<%= vendorDir %>/dhtmlx/dhtmlxgantt_quick_info.js',
					'<%= vendorDir %>/dhtmlx/dhtmlxgantt_locale_kr.js'
				],
				dest: '<%= distdir %>/dhtmlx.js'
			},
			dhtmlxCss: {
				src: ['<%= vendorDir %>/dhtmlx/dhtmlxgantt_terrace.css'],
				dest: '<%= distdir %>/dhtmlx.css'
			}
		},
		uglify: {
			dist:{
				options: {
					banner: "<%= banner %>"
				},
				src:['<%= src.js %>'],
				dest:'<%= distdir %>/<%= pkg.name %>.js'
			},
			angular: {
				src:['<%= concat.angular.src %>'],
				dest: '<%= distdir %>/angular.js'
			},
			mongo: {
				src:['<%= vendorDir %>/mongolab/*.js'],
				dest: '<%= distdir %>/mongolab.js'
			},
			bootstrap: {
				src:['<%= vendorDir %>/angular-ui/bootstrap/*.js'],
				dest: '<%= distdir %>/bootstrap.js'
			},
			jquery: {
				src:['<%= vendorDir %>/jquery/*.js'],
				dest: '<%= distdir %>/jquery.js'
			}
		},
		recess: {
			build: {
				files: {
					'<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
				},
				options: {
					compile: true
				}
			},
			min: {
				files: {
					'<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
				},
				options: {
					compress: true
				}
			}
		},
		watch:{
			all: {
				files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
				tasks:['default','timestamp']
			},
			build: {
				files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
				tasks:['build','timestamp']
			}
		},
		jshint:{
			files:['gruntFile.js', '<%= src.js %>', '<%= src.specs %>', '<%= src.scenarios %>'],
			options:{
				curly:true,
				eqeqeq:true,
				immed:true,
				latedef:true,
				newcap:true,
				noarg:true,
				sub:true,
				boss:true,
				eqnull:true,
				globals:{}
			}
		}
	});
};
