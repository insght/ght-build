#!/usr/bin/env node

var Liftoff = require('liftoff');
var ght = new Liftoff({
	name: 'ghtbuild',
	processTitle: 'ghtbuild',
	moduleName: 'ght-build',
	configName: 'ghtproject.js',
	extensions: {
		'.js': null,
		'.json': null
	},
	v8flags: ['--harmony'] // or v8flags: require('v8flags');
});
var argv = require('minimist')(process.argv.slice(2));
var invoke = function (env) {
	console.log('my environment is:', env);
	console.log('my cli options are:', argv);
	console.log('my liftoff config is:', this);
};
ght.launch({
	cwd: argv.cwd,
	configPath: 'ghtproject.js',
	require: argv.require,
	completion: argv.completion
}, invoke);
