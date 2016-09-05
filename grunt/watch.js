module.exports = {
    less: {
        files: ['src/css/less/*.less'],
        tasks: ['recess']
    },
    bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
    },
    html: {
        files: [
            'src{,*/}*.html',
            'src/tpl{,*/}*.html',
            'src/tpl/**/*.html'
        ],
        tasks: ['newer:jshint:all'],
        options: {
            livereload: ['connect:options:livereload']
        }
    },
    js: {
        files: [
            'src/js/{,*/}*.js',
            'src/js/**/*.js'
        ],
        tasks: ['newer:jshint:all'],
        options: {
            livereload: ['connect:options:livereload']
        }
    },
    gruntfile: {
        files: ['Gruntfile.js']
    },
    livereload: {
        options: {
            livereload: ['connect:options:livereload']
        },
        files: [
            'src/{,*/}*.html',
            'src/css/{,*/}*.css',
            'src/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
    }
};
