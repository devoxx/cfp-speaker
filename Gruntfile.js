'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {
  }

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/views/*.html',
          '<%= yeoman.app %>/views/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'images_dummy'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      e2e: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      e2eDist: {
        options: {
          port: 9002,
          hostname: 'localhost',
          base: yeomanConfig.dist,
          middleware: function (connect) {
            return [
                mountFolder(connect, 'images_dummy'),
                mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      },
      serverDist: {
        url: 'http://localhost:9002'
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        autoWatch: false
      },
      e2e: {
        configFile: 'karma-e2e.conf.js',
        singleRun: true,
        autoWatch: false
      }
    },
    coffee: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/scripts',
            src: '{,*/}*.coffee',
            dest: '.tmp/scripts',
            ext: '.js'
          }
        ]
      },
      test: {
        files: [
          {
            expand: true,
            cwd: 'test/spec',
            src: '{,*/}*.coffee',
            dest: '.tmp/spec',
            ext: '.js'
          }
        ]
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    // concat: {
    //   dist: {
    //     files: {

    //     }
    //   }
    // },
    useminPrepare: {
      html: ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/*.hbr.html'],
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html', '<%= yeoman.dist %>/{,views/**/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,**/}*.{png,jpg,jpeg,png}',
            dest: '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
           // https://github.com/yeoman/grunt-usemin/issues/44
           //collapseWhitespace: true,
           collapseBooleanAttributes: true,
           removeAttributeQuotes: true,
           removeRedundantAttributes: true,
           useShortDoctype: true,
           removeEmptyAttributes: true,
           removeOptionalTags: true*/
        },
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['*.html', 'views/**/*.html'],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>/scripts',
            src: '*.js',
            dest: '<%= yeoman.dist %>/scripts'
          }
        ]
      }
    },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ],
    //       '<%= yeoman.dist %>/scripts/scriptsstatic.js': [
    //         '<%= yeoman.dist %>/scripts/scriptsstatic.js'
    //       ]
    //     }
    //   }
    // },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,**/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,txt}',
              'config.js',
              'components/**/*',
              'images/{,*/}*.{gif,webp}',
              'styles/*.{eot,svg,ttf,woff}',
              'images_dummy/*'
            ]
          }
        ]
      },
      staticdev: { // Only during dev of static files 
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,txt}',
              '*.hbr.html',
              'components/**/*',
              'images/**/*',            
              'styles/*',
              'images_dummy/*',
              'scripts/main360.js'
            ]
          }
        ]
      }
    },
    cfpstatic: {
      dist: {
        files: '<%= yeoman.dist %>/',
        output: '<%= yeoman.dist %>',
        events: [
          {
            id: 7,
            key: "dv12",
            url: "https://staging-cfp.devoxx.com/rest/v1",
            trackMapping: { // track ID to image icon class
              "2" : "icon_architecture",
              "5" : "icon_alternative",
              "6" : "icon_methodology",
              "7" : "icon_cloud",
              "9" : "icon_javase",
              "10" : "icon_mobile",
              "13" : "icon_javaee",
              "19" : "icon_future",
              "22" : "icon_web"
            }
          },
          // {
          //   id: 10,
          //   key: "dv13",
          //   url: "https://staging-cfp.devoxx.com/rest/v1",
          //   trackMapping: {
              // "2" : "icon_architecture",
              // "5" : "icon_alternative",
              // "6" : "icon_methodology",
              // "7" : "icon_cloud",
              // "9" : "icon_javase",
              // "10" : "icon_mobile",
              // "13" : "icon_javaee",
              // "19" : "icon_future",
              // "22" : "icon_web"
          //   }
          // }
        ]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'clean:server',
    'coffee:dist',
    'compass:server',
    'livereload-start',
    'connect:livereload',
    'open:server',
    'watch'
  ]);

  grunt.registerTask('serverDist', [
    'clean:server',
    'coffee:dist',
    'compass:server',
    'connect:e2eDist',
    'open:serverDist',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'coffee',
    'compass',
    'connect:test',
    'karma:unit',
    'connect:e2e',
    'karma:e2e'
  ]);

  grunt.registerTask('test-e2e', [
    'clean:server',
    'coffee',
    'connect:e2e',
    'karma:e2e'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    //'jshint',
    'coffee',
    // 'test',
    'compass:dist',    
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy:dist',
    // // //'cdnify',
    'ngmin',
    'uglify',
    'rev',
    'usemin',
    'cfpstatic'
  ]);

  grunt.registerTask('static', ['clean', 'copy:staticdev', 'cfpstatic']);

  grunt.registerTask('default', ['build']);
};
