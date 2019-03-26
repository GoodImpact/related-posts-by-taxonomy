module.exports = function( grunt ) {

	require( 'load-grunt-tasks' )( grunt );

	'use strict';

	// Project configuration
	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		githash: {
			main: {
				options: {},
			}
		},

		addtextdomain: {
			options: {
				textdomain: 'related-posts-by-taxonomy',
			},
			target: {
				files: {
					src: [ '*.php', '**/*.php', '!node_modules/**', '!bin/**' ]
				}
			}
		},

		makepot: {
			target: {
				options: {
					domainPath: '/lang',
					mainFile: 'related-posts-by-taxonomy.php',
					potFilename: 'related-posts-by-taxonomy.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true
					},
					type: 'wp-plugin',
					updateTimestamp: true
				}
			}
		},

		uglify: {
			options: {
				banner: '/*\n' +
					' * ' + '<%= pkg.name %>\n' +
					' * ' + 'v<%= pkg.version %>\n' +
					' * ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
					' **/\n'
			},

			target: {
				files: {
					'includes/assets/js/lazy-loading.min.js': [ 'includes/assets/js/lazy-loading.js' ]
				}
			}
		},

		// Clean up build directory
		clean: {
			editor_block: ['includes/assets/js/editor-block.js'],
			main: [ 'build/<%= pkg.name %>' ]
		},

		// Copy the theme into the build directory
		copy: {
			editor_block: {
				src: 'editor-block/build/index.js',
				dest: 'includes/assets/js/editor-block.js'
			},
			main: {
				src: [
					'**',
					'!node_modules/**',
					'!bin/**',
					'!tests/**',
					'!build/**',
					'!editor-block/**',
					'!webpack.config.js',
					'!.git/**',
					'!Gruntfile.js',
					'!package.json',
					'!.gitignore',
					'!.gitmodules',
					'!.gitattributes',
					'!.editorconfig',
					'!**/Gruntfile.js',
					'!**/package.json',
					'!**/phpunit.xml',
					'!**/composer.lock',
					'!**/package-lock.json',
					'!**/README.md',
					'!**/readme.md',
					'!**/CHANGELOG.md',
					'!**/CONTRIBUTING.md',
					'!**/travis.yml',
					'!**/*~'
				],
				dest: 'build/<%= pkg.name %>/'
			}
		},

		version: {
			readmetxt: {
				options: {
					prefix: 'Stable tag: *'
				},
				src: [ 'readme.txt' ]
			},
			tested_up_to: {
				options: {
					pkg: {
						"version": "<%= pkg.tested_up_to %>"
					},
					prefix: 'Tested up to: *'
				},
				src: [ 'readme.txt', 'readme.md' ]
			},
			requires_at_least: {
				options: {
					pkg: {
						"version": "<%= pkg.requires_at_least %>"
					},
					prefix: 'Requires at least: *'
				},
				src: [ 'readme.txt', 'readme.md' ]
			},
			plugin: {
				options: {
					prefix: 'Version: *'
				},
				src: [ 'readme.md', 'related-posts-by-taxonomy.php' ]
			},
		},

		replace: {
			replace_branch: {
				src: [ 'readme.md' ],
				overwrite: true, // overwrite matched source files
				replacements: [ {
					from: /related-posts-by-taxonomy.svg\?branch=(master|develop)/g,
					to: "related-posts-by-taxonomy.svg?branch=<%= githash.main.branch %>"
				}, {
					from: /related-posts-by-taxonomy\/tree\/(master|develop)#pull-requests/g,
					to: "related-posts-by-taxonomy/tree/<%= githash.main.branch %>#pull-requests"
				} ]
			}
		},
		run: {
			build: {
				cmd: 'npm',
				options: {
					cwd: 'editor-block'
  				},
				args: [
					'run',
					'build'
				]
	 		}
		}
	} );


	grunt.registerTask( 'i18n', [ 'addtextdomain', 'makepot' ] );

	grunt.registerTask( 'travis', [ 'githash', 'replace:replace_branch' ] );

	// Creates build
	grunt.registerTask( 'build', [ 'clean:main', 'clean:editor_block', 'run:build', 'copy:editor_block', 'uglify', 'version', 'makepot', 'travis', 'copy:main' ] );

	grunt.util.linefeed = '\n';
};