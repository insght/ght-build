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
		var susy		= props.susy;
		var packageName	= props.packageName;
		var themeName	= props.themeName;
		var compass		= props.compass;

		if(packageName !== '' && themeName !== '') {
			var ght			= ghtModule;
			ght.themeName	= themeName;
			ght.packageName	= packageName;

			when(ght.createDirectories(), function(){
				if(gulp == 'yes') {
					ght.components.gulp();
				} else {
					console.log('Gulp will not installed');
				}

				if(bower == 'yes') {
					ght.components.bower();
				} else {
					console.log('Bower will not installed');
				}

				if(susy == 'yes') {
					ght.components.susy();
				} else {
					console.log('Susy will not installed');
				}

				if(compass == 'yes') {
					ght.components.compass();
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