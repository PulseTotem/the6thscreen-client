module.exports = function (grunt) {
    'use strict';

    // load extern tasks
    grunt.loadNpmTasks('grunt-update-json');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-include-source');
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
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-cache-breaker');

    // tasks
    grunt.initConfig({

        gruntConfig: grunt.file.readJSON('grunt-config.json'),
        coreReposConfig : grunt.file.readJSON('core-repos-config.json'),

// ---------------------------------------------
//                               configure tasks
// ---------------------------------------------

        symlink: {
            // Enable overwrite to delete symlinks before recreating them
            options: {
                overwrite: true
            },
            // The "build/target.txt" symlink will be created and linked to
            // "source/target.txt". It should appear like this in a file listing:
            // build/target.txt -> ../source/target.txt

            coreClient: {
                src: '<%= coreReposConfig.coreClientRepoPath %>',
                dest: 't6s-core/core-client'
            },
            core: {
                src: '<%= coreReposConfig.coreRepoPath %>',
                dest: 't6s-core/core-client/t6s-core/core'
            }
        },

        update_json: {
            packageHeroku: {
              src: ['packageHeroku.json'],
              dest: 'heroku/package.json',
              fields: [
                'name',
                'version',
                'dependencies',
                'devDependencies',
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
                files: 	[{expand: true, cwd: 'app/styles', src: ['**/*.css'], dest: 'build/css/'}]
            },
            /*buildLessStyles: {
                files: 	[{expand: true, cwd: 't6s-core/core-client/styles', src: ['**'], dest: 'build/static/'}]
            },*/
            buildStaticImages: {
                files: 	[{expand: true, cwd: 't6s-core/core-client/images', src: ['**'], dest: 'build/static/images/'}]
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
            distStyles: {
                files: 	[{expand: true, cwd: 'app/styles', src: ['**/*.css'], dest: 'tmp/css/'}]
            },
            /*distLessStyles: {
                files: 	[{expand: true, cwd: 't6s-core/core-client/styles', src: ['**'], dest: 'dist/static/'}]
            },*/
            distStaticImages: {
                files: 	[{expand: true, cwd: 't6s-core/core-client/images', src: ['**'], dest: 'dist/static/images/'}]
            },
            distScripts: {
                files: 	[{expand: true, cwd: 'app/scripts', src: ['**/*.js'], dest: 'dist/js/'}]
            },

            heroku: {
              files: 	[{expand: true, cwd: 'dist', src: ['**'], dest: 'heroku'}]
            },
            herokuProcfile: {
              files: 	[{expand: true, cwd: '.', src: ['Procfile'], dest: 'heroku'}]
            },
            herokuGitignore: {
              files: 	[{expand: true, cwd: '.', src: ['.gitignore'], dest: 'heroku'}]
            },
            herokuWebJS: {
              files: 	[{expand: true, cwd: '.', src: ['web.js'], dest: 'heroku'}]
            },
            karmaconf: {
                files: [{'build/tests/karma.conf.js': 'karma.conf.js'}]
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
                    basePath: 'build'
                },
                files: {
                    'build/index.html': 'app/index.html'
                }
            },
            dist: {
                options: {
                    basePath: 'dist'
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
            },
            karma: {
                cwd: 'build',
                src: ['build/tests/karma.conf.js'],
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                },
                devDependencies: true
            }
        },

        less: {
            build: {
                options: {
                    paths: ["app/styles", "t6s-core/core-client/styles/**/*"]
                },
                files: [
                  {"build/css/The6thScreenClient.css": "app/styles/**/*.less"},
                  {"build/css/The6thScreenClientRenderers.css": "t6s-core/core-client/styles/renderers/**/*.less"},
                  {"build/css/The6thScreenClientBehaviours.css": "t6s-core/core-client/styles/behaviours/**/*.less"},
                  {"build/css/The6thScreenClientThemes.css": "t6s-core/core-client/styles/themes/**/*.less"}
                ]
            },
            dist: {
                options: {
                    paths: ["app/styles"]
                },
                files: [
                  {"tmp/css/The6thScreenClient.css": "app/styles/**/*.less"},
                  {"tmp/css/The6thScreenClientRenderers.css": "t6s-core/core-client/styles/renderers/**/*.less"},
                  {"tmp/css/The6thScreenClientBehaviours.css": "t6s-core/core-client/styles/behaviours/**/*.less"},
                  {"tmp/css/The6thScreenClientThemes.css": "t6s-core/core-client/styles/themes/**/*.less"}
                ]
            },
            renderer: {
              options: {
                paths: ["t6s-core/core-client/styles/renderers"]
              },
              files: {
                'renderers/<%= grunt.option("rendererFileName") %>/<%= grunt.option("rendererFileName") %>.css': 't6s-core/core-client/styles/renderers/<%= grunt.option("rendererFileName") %>.less'
              }
            }
        },

        typescript: {
            build: {
                src: [
                    'app/scripts/**/*.ts',
                    't6s-core/core-client/scripts/**/*.ts'
                ],
                dest: 'build/js/Client.js'
            },
            dist: {
                src: [
                    'app/scripts/**/*.ts',
                    't6s-core/core-client/scripts/**/*.ts'
                ],
                dest: 'tmp/js/Client.js'
            },
            test: {
                src: [
                    'tests/**/*.ts'
                ],
                dest: 'build/tests/Test.js'
            },
            renderer: {
              src: [
                't6s-core/core-client/scripts/core/Logger.ts',
                't6s-core/core-client/scripts/renderer/<%= grunt.option("rendererFileName") %>.ts'
              ],
              dest: 'renderers/<%= grunt.option("rendererFileName") %>/<%= grunt.option("rendererFileName") %>.js'
            }
        },

        uglify: {
            dist: {
                files: [{
                    'dist/js/The6thScreenClient.min.js': 'tmp/js/Client.js'
                }]
            }
        },

        cssmin: {
            dist: {
                files: {
                    'dist/css/The6thScreenClient.min.css': ['tmp/css/*.css']
                }
            }
        },

        cachebreaker: {
          build: {
            options: {
              match: ['Client.js', "The6thScreenClient.css", "The6thScreenClientRenderers.css", "The6thScreenClientBehaviours.css", "The6thScreenClientThemes.css"]
            },
            files: {
              src: ['build/index.html']
            }
          },
          dist: {
            options: {
              match: ['The6thScreenClient.min.js', 'The6thScreenClient.min.css']
            },
            files: {
              src: ['dist/index.html']
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
                files: ['app/scripts/**/*.ts', 't6s-core/core-client/scripts/**/*.ts', 't6s-core/core-client/t6s-core/core/scripts/**/**.ts'],
                tasks: ['typescript:build']
            },

            developScripts: {
                files: 'app/scripts/**/*.js',
                tasks: ['copy:buildScripts', 'includeSource:build', 'wiredep:build', 'cachebreaker:build']
            },

            developStyles: {
                files: 'app/styles/**/*.css',
                tasks: ['copy:buildStyles', 'includeSource:build', 'wiredep:build', 'cachebreaker:build']
            },

            developLessStyles: {
                //files: 'app/styles/**/*.less',
                files: ['app/styles/**/*.less', 't6s-core/core-client/styles/**/*.less'],
                tasks: ['less:build', 'includeSource:build', 'wiredep:build', 'cachebreaker:build']
            },

            developStaticImages: {
                files: ['t6s-core/core-client/images/**'],
                tasks: ['copy:buildStaticImages']
            },

            developIndex: {
                files: 'app/index.html',
                tasks: ['includeSource:build', 'wiredep:build', 'cachebreaker:build']
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
                configFile: 'build/tests/karma.conf.js',
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
            heroku: ['heroku/'],
            tmp: ['tmp/'],
            configure: ['bower_components'],
            doc: ['doc'],
            test: ['build/tests/'],
            renderer: ['renderers/']
        }
// ---------------------------------------------
    });

    // register tasks
    grunt.registerTask('default', ['build']);

    grunt.registerTask('init', ['symlink:coreClient']);

    grunt.registerTask('initJenkins', ['init','symlink:core']);

    grunt.registerTask('configure', function() {
        grunt.task.run(['bower']);
    });

    grunt.registerTask('configureTest', function() {
        grunt.task.run(['bower']);
    });

    //grunt.registerTask('copyBuild', ['copy:buildBowerComponents', 'copy:buildBowerrc', 'copy:buildBowerFile', 'copy:buildAssets', 'copy:buildStyles', 'copy:buildScripts', 'copy:buildLessStyles', 'copy:buildStaticImages']);

    //grunt.registerTask('copyDist', ['copy:distBowerComponents', 'copy:distBowerrc', 'copy:distBowerFile', 'copy:distAssets', 'copy:distStyles', 'copy:distScripts', 'copy:distLessStyles', 'copy:distStaticImages']);

  grunt.registerTask('copyBuild', ['copy:buildBowerComponents', 'copy:buildBowerrc', 'copy:buildBowerFile', 'copy:buildAssets', 'copy:buildStyles', 'copy:buildScripts', 'copy:buildStaticImages']);

  grunt.registerTask('copyDist', ['copy:distBowerComponents', 'copy:distBowerrc', 'copy:distBowerFile', 'copy:distAssets', 'copy:distStyles', 'copy:distScripts', 'copy:distStaticImages']);


  grunt.registerTask('build', function () {
        grunt.task.run(['clean:build']);

        if (! grunt.file.exists('./bower_components')) {
            grunt.task.run(['configure']);
        }

        grunt.task.run(['copyBuild', 'typescript:build', 'less:build', 'includeSource:build', 'wiredep:build', 'cachebreaker:build']);
    });

    grunt.registerTask('dist', function () {
        grunt.task.run(['clean:dist']);

        if (! grunt.file.exists('./bower_components')) {
            grunt.task.run(['configure']);
        }

        grunt.task.run(['copyDist', 'typescript:dist', 'less:dist', 'uglify', 'cssmin', 'includeSource:dist', 'wiredep:dist', 'clean:tmp', 'cachebreaker:dist']);
    });

    grunt.registerTask('heroku', function () {
      grunt.task.run(['clean:heroku']);

      grunt.task.run(['dist', 'update_json:packageHeroku', 'copy:heroku', 'copy:herokuProcfile', 'copy:herokuGitignore', 'copy:herokuWebJS']);
    });

//    grunt.registerTask('deploy', ['dist', 'sftp:deploy']);

    grunt.registerTask('develop', ['build', 'connect', 'watch']);

    grunt.registerTask('doc', ['clean:doc', 'yuidoc']);

    grunt.registerTask('test', function() {
        grunt.task.run(['build']);

        if (! grunt.file.exists('./bower_components')) {
            grunt.task.run(['configureTest']);
        }

        grunt.task.run(['typescript:test', 'copy:karmaconf', 'wiredep:karma', 'karma:unit']);
    });


  var rendererNames = new Array();
  var rendererId = null;

  grunt.registerTask('nextRenderer', function() {
    if(rendererId == null) {
      rendererId = 0;
    } else {
      rendererId++;
    }

    if(rendererId < rendererNames.length) {
      var rendererName = rendererNames[rendererId];
      grunt.option('rendererFileName', rendererName);
      grunt.task.run(['typescript:renderer']);
      grunt.task.run(['less:renderer']);
      grunt.task.run(['nextRenderer']);
    }
  });

  grunt.registerTask('renderer', function(name) {
      grunt.task.run(['clean:renderer']);
      if(arguments.length == 0) {
        var renderers = grunt.file.expand('t6s-core/core-client/scripts/renderer/**/*.ts');
        renderers.forEach(function(rendererFile) {
          var rendererNameSplitted = rendererFile.split('/');

          var rendererTSName = rendererNameSplitted[rendererNameSplitted.length - 1];

          var rendererName = rendererTSName.substr(0, rendererTSName.length - 3);

          if(rendererName != "Renderer") {
            rendererNames.push(rendererName);
          }
        });

        grunt.task.run(['nextRenderer']);

      } else {
        grunt.option('rendererFileName', name);
        grunt.task.run(['typescript:renderer']);
        grunt.task.run(['less:renderer']);
      }
  });

}