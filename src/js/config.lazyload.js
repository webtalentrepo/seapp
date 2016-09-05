// lazyload config

angular.module('app')
	/**
	 * jQuery plugin config use ui-jq directive , config the js and css files that required
	 * key: function name of the jQuery plugin
	 * value: array of the css js file located
	 */
	.constant('JQ_CONFIG', {
			moment: ['../libs/jquery/moment/moment.js'],
			highchart: [
				'../libs/jquery/highcharts/highcharts.js'
			],
			md5: [
				'../libs/jquery/md5/md5.js'
			]
		}
	)
	.constant('MODULE_CONFIG', [
			{
				name: 'toaster',
				files: [
					'../libs/angular/angularjs-toaster/toaster.js',
					'../libs/angular/angularjs-toaster/toaster.css'
				]
			},
			{
				name: 'angular-skycons',
				files: [
					'../libs/angular/angular-skycons/angular-skycons.js'
				]
			},
			{
				name: 'xeditable',
				files: [
					'../libs/angular/angular-xeditable/dist/js/xeditable.min.js',
					'../libs/angular/angular-xeditable/dist/css/xeditable.css'
				]
			},
			{
				name: 'ngImgCrop',
				files: [
					'../libs/angular/ngImgCrop/compile/minified/ng-img-crop.js',
					'../libs/angular/ngImgCrop/compile/minified/ng-img-crop.css'
				]
			}
		]
	)
	// oclazyload config
	.config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function ($ocLazyLoadProvider, MODULE_CONFIG) {
		// We configure ocLazyLoad to use the lib script.js as the async loader
		$ocLazyLoadProvider.config({
			debug: false,
			events: true,
			modules: MODULE_CONFIG
		});
	}])
;
