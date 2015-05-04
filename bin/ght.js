#!/usr/bin/env node
var ghtModule	= require('../index.js');
var Liftoff		= require('liftoff');
var promise		= require('node-promise');
var prompt		= require('prompt');
var ghtConf		= require('../ght.schema.js');

var ght = new Liftoff({
	name:			'ghtbuild',
	processTitle:	'ghtbuild',
	moduleName:		'ght-build',
	configName:		'ghtproject',
	extensions:		{ '.json': null },
	v8flags:		require('v8flags')
});
var argv = require('minimist')(process.argv.slice(2));

var invoke = function (env) {
	var when = promise.when;

	when(ghtModule.createDirectories(), function(){
		prompt.start();

		var prompts = ghtConf.promptProperties;
		prompt.get(prompts, function (error, props) {
			var gulp	= props.gulp;
			var bower	= props.bower;
			var susy	= props.susy;
			var compass	= props.compass;

			if(gulp == 'yes') {
				ghtModule.components.gulp();
			} else {
				console.log('Gulp will not installed');
			}

			if(bower == 'yes') {
				ghtModule.components.bower();
			} else {
				console.log('Bower will not installed');
			}

			if(susy == 'yes') {
				ghtModule.components.susy();
			} else {
				console.log('Susy will not installed');
			}

			if(compass == 'yes') {
				ghtModule.components.compass();
			} else {
				console.log('Compass will not installed');
			}
		});
	});
};

ght.launch({
	cwd:		argv.cwd,
	configPath:	'ghtproject',
	require:	argv.require,
	completion:	argv.completion
}, invoke);