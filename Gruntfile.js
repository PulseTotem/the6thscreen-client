
module.exports = function (grunt) {
	'use strict';

	// load extern tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-typescript');

	// tasks
	grunt.initConfig({

// ---------------------------------------------
//                                   build tasks
// ---------------------------------------------
		typescript: {
			build: {
				src: [
					'src/**/*.ts'
				],
				dest: 'build/The6thScreenClient.js'
			}
		},
// ---------------------------------------------

// ---------------------------------------------
//                                    clean task
// ---------------------------------------------
		clean: {
			build: ['build']
		}
// ---------------------------------------------
	});

	// register tasks
	grunt.registerTask('default', ['build']);
	
	grunt.registerTask('build', function() {
		grunt.task.run(['clean:build']);
		
		grunt.task.run(['typescript:build']);
	});

}








/////////////////////////////////////////////////////////////////////////////////////








module.exports = function (grunt) {
    'use strict';

    // load extern tasks
    grunt.loadNpmTasks('grunt-update-json');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-karma');
//    grunt.loadNpmTasks('grunt-ssh');

    // tasks
    grunt.initConfig({

        gruntConfig: grunt.file.readJSON('grunt-config.json'),

// ---------------------------------------------
//                               configure tasks
// ---------------------------------------------
        update_json: {
            bowerBuild: {
                src: ['build.bower.json'],
                dest: 'bower.json',
                fields: [
                    'name',
                    'version',
                    'dependencies',
                    'overrides'
                ]
            },
            bowerTest: {
                src: ['build.bower.json', 'tests.bower.json'],
                dest: 'bower.json',
                fields: [
                    'name',
                    'version',
                    'dependencies',
                    'overrides'
                ]
            }
        },

        bower: {
            configure: {
                options: {
                    targetDir: 'bower_components',
                    copy: false
                }
            }
        },

        gitclone: {
            configure: {
                options: {
                    repository: '<%= gruntConfig.visulabGitRepo %>',
                    branch: '<%= gruntConfig.visulabGitBranch %>',
                    directory: './vendor/the6thscreen-client'
                }
            }
        },
// ---------------------------------------------





// ---------------------------------------------
//                          build and dist tasks
// ---------------------------------------------
        copy: {
            buildBowerComponents: {
                files : [{expand: true, cwd: 'bower_components', src: ['**'], dest: 'build/libs/'}]
            },
            buildBowerrc: {
                files: 	[{'build/.bowerrc': 'build.bowerrc'}]
            },
            buildBowerFile: {
                files: 	[{'build/bower.json': 'bower.json'}]
            },
            buildAssets: {
                files: 	[{expand: true, cwd: 'app/assets', src: ['**'], dest: 'build/assets/'}]
            },
            buildStyles: {
                files: 	[{expand: true, cwd: 'app/styles', src: ['**'], dest: 'build/css/'}]
            },
            buildScripts: {
                files: 	[{expand: true, cwd: 'app/scripts', src: ['**/*.js'], dest: 'build/js/'}]
            },

            distBowerComponents: {
                files : [{expand: true, cwd: 'bower_components', src: ['**'], dest: 'dist/libs/'}]
            },
            distBowerrc: {
                files: 	[{'dist/.bowerrc': 'build.bowerrc'}]
            },
            distBowerFile: {
                files: 	[{'dist/bower.json': 'bower.json'}]
            },
            distAssets: {
                files: 	[{expand: true, cwd: 'app/assets', src: ['**'], dest: 'dist/assets/'}]
            },
            distScripts: {
                files: 	[{expand: true, cwd: 'app/scripts', src: ['**/*.js'], dest: 'dist/js/'}]
            }
        },

        includeSource: {
            options: {
                baseUrl: '',
                templates: {
                    html: {
                        js: '<script type="text/javascript" src="{filePath}"></script>',
                        css: '<link rel="stylesheet" type="text/css" href="{filePath}" />'
                    }
                }
            },
            build: {
                options: {
                    basePath: 'build',
                },
                files: {
                    'build/index.html': 'app/index.html'
                }
            },
            dist: {
                options: {
                    basePath: 'dist',
                },
                files: {
                    'dist/index.html': 'app/index.html'
                }
            }
        },

        wiredep: {
            build: {
                cwd: 'build',
                src: ['build/index.html']
            },
            dist: {
                cwd: 'dist',
                src: ['dist/index.html']
            }
        },

        typescript: {
            build: {
                src: [
                    'app/scripts/The6thScreenClient.ts.ts'
                ],
                dest: 'build/js/The6thScreenClient.ts.js'
            },
            dist: {
                src: [
                    'app/scripts/The6thScreenClient.ts.ts'
                ],
                dest: 'tmp/js/The6thScreenClient.ts.js'
            },
            test: {
                src: [
                    'app/tests/**/*.ts'
                ],
                dest: 'tests/Test.js'
            }
        },

        uglify: {
            dist: {
                files: [{
                    'dist/js/The6thScreenClient.min.js': 'tmp/js/The6thScreenClient.js'
                }]
            }
        },

        cssmin: {
            dist: {
                files: {
                    'dist/css/The6thScreenClient.min.css': ['app/styles/*.css']
                }
            }
        },
// ---------------------------------------------





// ---------------------------------------------
//                                 develop tasks
// ---------------------------------------------
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729
            },

            develop: {
                options: {
                    open: true,
                    base: 'build'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },

            developTypescript: {
                files: ['app/scripts/**/*.ts', 'vendor/the6thscreen-client/**/*.ts'],
                tasks: ['typescript:build']
            },

            developScripts: {
                files: 'app/scripts/**/*.js',
                tasks: ['copy:buildScripts', 'includeSource:build', 'wiredep:build']
            },

            developStyles: {
                files: 'app/styles/**',
                tasks: ['copy:buildStyles', 'includeSource:build', 'wiredep:build']
            },

            developIndex: {
                files: 'app/index.html',
                tasks: ['includeSource:build', 'wiredep:build']
            },

            developAssets: {
                files: 'app/assets/**',
                tasks: ['copy:buildAssets']
            },

            developTest: {
                files: 'app/tests/**/*.ts',
                tasks: ['clean:test', 'typescript:test', 'karma']
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 deploy tasks
// ---------------------------------------------
        /*deployInfos: grunt.file.readJSON('deploy-infos.json'),

         sftp: {
         deploy: {
         files: {
         "./": "dist/**"
         },
         options: {
         path: '<%= deployInfos.path %>',
         host: '<%= deployInfos.host %>',
         username: '<%= deployInfos.username %>',
         password: '<%= deployInfos.password %>',
         srcBasePath: "dist/",
         createDirectories: true,
         showProgress: '<%= deployInfos.showProgress %>'
         }
         }
         },*/
// ---------------------------------------------

// ---------------------------------------------
//                                 doc tasks
// ---------------------------------------------
        yuidoc: {
            compile: {
                name: '<%= gruntConfig.name %>',
                description: '<%= gruntConfig.description %>',
                version: '<%= gruntConfig.version %>',
                url: '<%= gruntConfig.homepage %>',
                options: {
                    extension: '.ts, .js',
                    paths: ['app/scripts/'],
                    outdir: 'doc/'
                }
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 test tasks
// ---------------------------------------------
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                    clean task
// ---------------------------------------------
        clean: {
            build: ['build/'],
            dist: ['dist/', 'tmp/'],
            tmp: ['tmp/'],
            configure: ['vendor/the6thscreen-client/', 'bower_components', 'bower.json'],
            //configure: ['bower_components', 'bower.json'],
            doc: ['doc'],
            test: ['tests']
        }
// ---------------------------------------------
    });

    // register tasks
    grunt.registerTask('default', ['build']);

    grunt.registerTask('configure', function() {
        if (! grunt.file.exists('./vendor/the6thscreen-client')) {
            grunt.task.run(['gitclone']);
        }

        grunt.task.run(['update_json:bowerBuild', 'bower']);
    });

    grunt.registerTask('configureTest', function() {
        if (! grunt.file.exists('./vendor/the6thscreen-client')) {
            grunt.task.run(['gitclone']);
        }

        grunt.task.run(['update_json:bowerTest', 'bower']);
    });

    grunt.registerTask('copyBuild', ['copy:buildBowerComponents', 'copy:buildBowerrc', 'copy:buildBowerFile', 'copy:buildAssets', 'copy:buildStyles', 'copy:buildScripts']);

    grunt.registerTask('copyDist', ['copy:distBowerComponents', 'copy:distBowerrc', 'copy:distBowerFile', 'copy:distAssets', 'copy:distScripts']);

    grunt.registerTask('build', function () {
        grunt.task.run(['clean:build']);

        if (! grunt.file.exists('./bower_components') || ! grunt.file.exists('./vendor/the6thscreen-client')) {
            grunt.task.run(['configure']);
        }

        grunt.task.run(['copyBuild', 'typescript:build', 'includeSource:build', 'wiredep:build']);
    });

    grunt.registerTask('dist', function () {
        grunt.task.run(['clean:dist']);

        if (! grunt.file.exists('./bower_components') || ! grunt.file.exists('./vendor/the6thscreen-client')) {
            grunt.task.run(['configure']);
        }

        grunt.task.run(['copyDist', 'typescript:dist', 'uglify', 'cssmin', 'includeSource:dist', 'wiredep:dist', 'clean:tmp']);
    });

//    grunt.registerTask('deploy', ['dist', 'sftp:deploy']);

    grunt.registerTask('develop', ['build', 'connect', 'watch']);

    grunt.registerTask('doc', ['clean:doc', 'yuidoc']);

    grunt.registerTask('test', function() {
        grunt.task.run(['clean:test']);

        if (! grunt.file.exists('./bower_components') || ! grunt.file.exists('./vendor/the6thscreen-client')) {
            grunt.task.run(['configureTest']);
        }

        grunt.task.run(['typescript:test', 'karma:unit']);
    });

}