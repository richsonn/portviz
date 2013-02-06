/*global module:false*/
module.exports = function (grunt) {

  grunt.initConfig({
    pkg: '<json:package.json>',
    clean: {
      dist: ["dist"]
    },
    lint: {
      grunt: 'grunt.js',
      src: 'src/**/*.js',
      tests: 'test/**/*.js'
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: [
          'src/infimum.js',
          'src/util/csv2json.js',
          'src/util/mersenne-twister.js',
          'src/util/util.js',
          'src/optimization/knapsack.js',

          'src/map/map.js',
          'src/data/portviz-data.js',
          'src/model/model.js',
          'src/charts/charts.js',
          'src/charts/util.js',

          'src/charts/bar.js',
          'src/charts/bingo.js',
          'src/charts/bubble.js',
          'src/charts/diff.js',
          'src/charts/line.js',
          'src/charts/multi.js',

          'src/charts/pareto.js',
          'src/charts/scatter.js',
          'src/charts/stacked-bar.js',
          'src/charts/stacked-bar-line.js',
          'src/charts/table.js',

          'src/ui/upload.js',
          'src/ui/viz.js',
          'src/ui/ui.js',
          'src/view/view.js',
          'src/supremum.js'
        ],
        dest: 'dist/js/portviz.js'
      }
    },
    copy: {
      dist: {
        files: {
          "dist/": "html/*",
          "dist/css/": "css/*"
        }
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'dist/js/portviz.min.js'
      }
    },
    jshint: {
      grunt: {
        options: {
          boss: true,
          browser: true,
          devel: true,
          eqeqeq: true,
          eqnull: true, 
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true, 
          node: true,
          strict: false,
          unused: true,
          funcscope: true,
          indent: 2
        },
        globals: {task: true,
        config: true,
        file: true,
        log: true,
        template: true}
      },
      src: {
        options: {
          boss: true,
          browser: true,
          devel: true,
          eqeqeq: true,
          eqnull: true, 
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true, 
          jquery: true,
          scripturl: true,
          unused: true,
          funcscope: true
          //indent: 2
        },
        globals: { }
      },
      tests: {
        options: {
          boss: true,
          browser: true,
          devel: true,
          eqeqeq: true,
          eqnull: true, 
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true,
          unused: true,
          funcscope: true,
          indent: 2
        },
        globals: {
          module: false,
          test: false,
          ok: false,
          equal: false,
          deepEqual: false,
          QUnit: false,
          throws: false

        }
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-junit');

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min copy');

};
