module.exports = {
	less: {
        files: {
          'src/css/app.css': [
            'src/css/less/app.less'
          ]
        },
        options: {
          compile: true
        }
    },
    html: {
        files: {
            'html/css/app.min.css': [
                'src/css/*.css'
            ]
        },
        options: {
            compress: true
        }
    }
}
