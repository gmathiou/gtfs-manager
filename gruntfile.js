// Gruntfile with the configuration of grunt-express and grunt-open. No livereload yet!
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-wiredep');

  // Configure Grunt 
  grunt.initConfig({
    // grunt-watch will monitor the projects files
    watch: {
      all: {
        files: 'public/**',
        options: {
          livereload: true
        }
      }
    },
    wiredep: {
      task: {
        src: [
          'views/*.hjs'
        ],
        options: {
          ignorePath: "public/"
        }
      }
    }
  });

  // Creates the `server` task
  grunt.registerTask('default', [
    'wiredep'
  ]);
};