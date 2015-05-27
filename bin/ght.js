#!/usr/bin/env node
var ghtModule	= require('../index.js'),
	ghtConf		= require('../app/ght.schema.js');

var Liftoff		= require('liftoff'),
	promise		= require('node-promise'),
	prompt		= require('prompt'),
	console		= require('logbrok')(
		{
			title:     'Ght Generator', 
			log_level: 'warn', 
			color:      true 
		}
	);

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

	console.info('Welcome to Magento Theme Generator :)');

	prompt.start();

	var prompts = ghtConf.promptProperties;
	prompt.get(prompts, function (error, props) {
		var gulp		= props.gulp 	=== 'yes',
			bower		= props.bower 	=== 'yes',
			compass		= props.compass === 'yes',
			preProcessor= props.preProcessor;

		var packageName	= props.packageName,
			themeName	= props.themeName;

		if(packageName !== '' && themeName !== '') {
			var ght			= ghtModule;
			ght.themeName	= themeName;
			ght.packageName	= packageName;
			ght.preProcessor= preProcessor

			when(ght.component('magento').frontendThemeDirs(preProcessor), function(){
				if(gulp) {
					ght.component('gulp').installation(gulp);
				} else {
					console.info('Gulp will not installed');
				}

				if(bower) {
					ght.component('bower').installation();
				} else {
					console.info('Bower will not installed');
				}

				if(compass) {
					ght.component('compass').installation();
				} else {
					console.info('Compass will not installed');
				}
			});
		} else {
			process.exit(0);
		}
	});
};

var config = {
	cwd:		argv.cwd,
	configPath:	'ght-project',
	require:	argv.require,
	completion:	argv.completion
};
ght.launch(config, invoke);