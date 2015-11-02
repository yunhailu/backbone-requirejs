require.config({
	baseUrl: './js/',
	paths: {
		'jquery': 'lib/jquery',
		'underscore': 'lib/underscore',
		'Backbone': 'lib/backbone',
		'juicer': 'lib/juicer',
		'routes': 'routes',
		'app': 'app',
		'view': 'view',
		'handle': 'handle'
	},
	shim: {
		'Backbone' : { 
			exports: 'Backbone',
			deps: ['jquery','underscore']
		},
		'jquery':{
			exports: '$'
		}
	}
});
define(['app'], function (app) {
	app.init();
});