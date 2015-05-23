module.exports = function(grunt) {
  
  grunt.initConfig({
    watch: {
      'public': {
        files: './app/public/**/*.js',
        tasks: ['babel']
      },
      node: {
        files: ['./app/**/*.js', '!./app/public/**/*.js'],
        tasks: ['execute:babelNode'],
        options: {
          nospawn: true
        }
      }
    },
    'babel': {
      options: {
        sourceMap: true,
      },
      dist: {
        files: {
          'build/public/bundle.js': 'app/public/js/app.js'
        }
      },
    },
    execute: {
      babelNode: {
        src: ['babel-node-task.js'],
        options: {},
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('default', ['watch']);

  grunt.event.on('watch', function(action, filepath) {
    grunt.config('execute.babelNode.options.args', [filepath]);
  });
};
