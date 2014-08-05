
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

