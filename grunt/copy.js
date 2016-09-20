module.exports = {
	libs:{
		files:[
			{
				src:  [
					'angular/angular.js',
					'angular-animate/angular-animate.js',
					'angular-cookies/angular-cookies.js',
					'angular-resource/angular-resource.js',
					'angular-sanitize/angular-sanitize.js',
					'angular-ui-router/release/**',
					'ngstorage/ngStorage.js',
					'angular-object-table/build/object-table.js',
					'angular-spineditor/src/angular-spineditor.js',
					'angular-file-upload/angular-file-upload.js',
					'dirPagination/dirPagination.js',
					'angular-bootstrap/ui-bootstrap-tpls.js',
					'angular-ui-select/dist/**',
					'angular-xeditable/dist/**',
					'angularjs-toaster/toaster.js',
					'angularjs-toaster/toaster.css',
					'angular-skycons/angular-skycons.min.js',
					'oclazyload/dist/**'
				],
				dest: 'libs/angular',
				cwd:  'bower_components',
				expand: true
			},
			{
				src:  [
					'jquery/dist/jquery.js',
					'bootstrap/dist/**',
					'plugins/integration/bootstrap/3/**',
					'plugins/integration/bootstrap/images/**',
					'jquery_appear/jquery.appear.js'
				],
				dest: 'libs/jquery',
				cwd:  'bower_components',
				expand: true
			},
			{
				src:  [
					'animate.css/animate.css',
					'font-awesome/css/**',
					'font-awesome/fonts/**',
					'simple-line-icons/css/**',
					'simple-line-icons/fonts/**',
					'bootstrap-rtl/dist/css/bootstrap-rtl.min.css'
				],
				dest: 'libs/assets',
				cwd:  'bower_components',
				expand: true
			},
			{src: '**', cwd: 'bower_components/bootstrap/dist/fonts', dest: 'src/fonts', expand: true}
		]
	},
	angular: {
		files: [
			{expand: true, src: ['**', '!**/less/**'], cwd: 'src/',   dest: "angular/"}
		]
	},
	html: {
		files: [
			{expand: true, src: '**', cwd:'src/fonts/', dest: 'html/fonts/'},
			{expand: true, src: "**", cwd: 'src/api',     dest: "html/api"},
			{expand: true, src: '**', cwd:'src/img/', dest: 'html/img/'},
			{expand: true, src: '*.css', cwd:'src/css/', dest: 'html/css/'},
			{expand: true, src: '**', cwd:'swig/js/', dest: 'html/js/'}
		]
	},
	landing: {
		files: [
			{expand: true, src:'**', cwd:'src/fonts/', dest: 'landing/fonts/'},
			{expand: true, src:'*.css', cwd:'src/css/', dest: 'landing/css/'},
			{src:'html/css/app.min.css', dest: 'landing/css/app.min.css'}
		]
	}
	
};