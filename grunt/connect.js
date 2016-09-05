module.exports = {
    options: {
        port: 8080,
        hostname: '127.0.0.1',
        livereload: 35729
    },
    livereload: {
        options: {
            open: true,
            middleware: function (connect) {
                return [
                    connect.static('.tmp'),
                    connect().use(
                        '/bower_components',
                        connect.static('./bower_components')
                    ),
                    connect().use(
                        '/src/css',
                        connect.static('./src/css')
                    ),
                    connect.static('src')
                ];
            }
        }
    }
};