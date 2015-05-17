#!/usr/bin/env node
var ghtModule	= require('../index.js');
var ghtConf		= require('../app/ght.schema.js');

var Liftoff		= require('liftoff');
var promise		= require('node-promise');
var prompt		= require('prompt');

var ght = new Liftoff({
	name:			'ghtbuild',
	processTitle:	'ghtbuild',
	moduleName:		'ght-build',
	configName:		'ght-project',
	extensions:		{ '.json': null },
	v8flags:		require('v8flags')
});
var argv = require('minimist')(process.argv.slice(2));

var invoke = function (env) {
	var when = promise.when;
	prompt.start();

	var prompts = ghtConf.promptProperties;
	prompt.get(prompts, function (error, props) {
		var gulp		= props.gulp;
		var bower		= props.bower;
		var packageName	= props.packageName;
		var themeName	= props.themeName;
		var compass		= props.compass;

		if(packageName !== '' && themeName !== '') {
			var ght			= ghtModule;
			ght.themeName	= themeName;
			ght.packageName	= packageName;

			when(ght.createDirectories(), function(){
				if(gulp == 'yes') {
					ght.component('gulp').installation();
				} else {
					console.log('Gulp will not installed');
				}

				if(bower == 'yes') {
					ght.component('bower').installation();
				} else {
					console.log('Bower will not installed');
				}

				if(compass == 'yes') {
					ght.component('compass').installation();
				} else {
					console.log('Compass will not installed');
				}
			});
		} else {
			process.exit(0);
		}
	});
};

ght.launch({
	cwd:		argv.cwd,
	configPath:	'ght-project',
	require:	argv.require,
	completion:	argv.completion
}, invoke);