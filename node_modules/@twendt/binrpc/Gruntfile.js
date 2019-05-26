module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc2md: {
            oneOutputFile: {
                src: 'lib/*.js',
                dest: 'doc/api.md'
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: ['doc/README.header.md', 'doc/api.md', 'doc/README.footer.md'],
                dest: 'README.md'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
    grunt.registerTask('doc', ['jsdoc2md', 'concat']);
};
