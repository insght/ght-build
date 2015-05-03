#!/usr/bin/env node
var ghtModule	= require('../index.js');
var Liftoff		= require('liftoff');

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
	ghtModule.init();
};

ght.launch({
	cwd:		argv.cwd,
	configPath:	'ghtproject',
	require:	argv.require,
	completion:	argv.completion
}, invoke);
