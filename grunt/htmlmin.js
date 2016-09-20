module.exports = {
	min: {
		options: {
			removeComments: true,
			collapseWhitespace: true
		},
		files: [{
			expand: true,
			cwd: 'src/tpl/',
			src: ['*.html', '**/*.html'],
			dest: 'angular/tpl/',
			ext: '.html',
			extDot: 'first'
		}]
	}
};