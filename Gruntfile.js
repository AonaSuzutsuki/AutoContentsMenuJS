module.exports = function (grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,
        /**
         * Delete files and directories.
         */
        clean: {
            build: ['.tmp', 'dist'],
            release: ['.tmp']
        },

        /**
         * Copy files and directories.
         */
        copy: {
            html: {
                files: [{
                    expand: true,
                    cwd: 'src/html',
                    src: ['*.html'],
                    dest: 'dist'
                }]
            }
        },

        /**
         * Combines and compresses CSS and JavaScript, and updates the HTML reference path.
         */
        // useminPrepare: {
        //     html: 'src/html/*.html',
        //     options: {
        //         dest: 'dist'
        //      }
        // },
        // usemin: {
        //     html: 'dist/*.html',
        //     options: {
        //         dest: 'dist'
        //      }
        // },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/html',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            }
        },

        uglify: {
            options: {
                output: {
                    comments: 'some'
                }
            },
            dist: {
                files: {
                    // Output file: Original file
                    'dist/js/AutoContentsMenuGenerator.min.js': '.tmp/AutoContentsMenuGenerator.js'
                }
            }
        },

        concat: {
            files: {
                // Original file
                src: 'src/*.js',
                // Output file
                dest: '.tmp/AutoContentsMenuGenerator.js'
            }
        },

        /**
         * Settings to monitor changes to the folder.
         * While running "$ grunt watch", perform the specified task every time there is a change.
         * @type {Object}
         */
        watch: {
            scripts: {
                files: ['src/*.js', 'src/html/*.html', 'src/html/*.css'],
                tasks: ['build']
            }
        }
    });

    Object.keys(pkg.devDependencies).forEach(function (devDependency) {
        if (devDependency.match(/^grunt\-/)) {
            grunt.loadNpmTasks(devDependency);
        }
    });

    grunt.registerTask('build', ['clean:build', 'copy', 'concat', 'uglify', 'cssmin', 'clean:release']);
    grunt.registerTask('default', ['watch']);
};
