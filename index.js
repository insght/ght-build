'use strict';

// modules
var fs		= require('fs');
var fse 	= require('fs-extra');
var path	= require('path');
var promise	= require('node-promise');
var mkdirp	= require('mkdirp');
var exec	= require('child_process').exec;

// app
var settings = JSON.parse(fs.readFileSync('ght-project.json','utf8'));

var skinPath =  function(additional) {
	return 'skin/frontend/' + settings.name + '/' + additional
};
var designPath =  function(additional) {
	return 'app/design/frontend/' + settings.name + '/' + additional
};

module.exports = {
	createEmptyDirectories: function(){
		// skin dir
		mkdirp(skinPath(), console.log);
		mkdirp(skinPath('default'), console.log);
		mkdirp(skinPath('default/scss'), console.log);
		mkdirp(skinPath('default/images'), console.log);
		mkdirp(skinPath('default/css'), console.log);
		mkdirp(skinPath('default/js'), console.log);
		mkdirp(skinPath('default/js/vendor'), console.log);
		mkdirp(skinPath('default/js/main'), console.log);

		// app design dirs
		mkdirp(designPath(), console.log);
		mkdirp(designPath('default'), console.log);
	},
	createFiles: function(cwd) {
		// scss
		for (var key in settings.fileAndDirs.scss) {
			mkdirp(skinPath('default/scss/' + key), console.log);

			settings.fileAndDirs.scss[key].forEach(function(data){
				fs.writeFile(skinPath('default/scss/' + key + '/' + data), null, console.log);
			});
		}

		fse.copy(__dirname + '/templates/_bower.temp.json', 'bower.json', console.log);
		fse.copy(__dirname + '/templates/_gulpfile.temp.js', 'gulpfile.js', console.log);
	},
	init: function(cwd) {
		var ght_ = this;
		var when = require("node-promise").when;
		when(this.createEmptyDirectories(), function(){
			ght_.createFiles(cwd);
		});
	}
};