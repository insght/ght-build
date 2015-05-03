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

var createdLog = function(error, dir) {
	if(!error) return console.log(dir + ' - Created!');

	return console.log(error, ' - error: ' + error);
};

module.exports = {
	createEmptyDirectories: function(){
		// skin dir

		mkdirp(skinPath(), function(error){
			createdLog(error, skinPath());
		});

		mkdirp(skinPath('default'),function(error){
			createdLog(error, skinPath('default'));
		});
		mkdirp(skinPath('default/scss'), function(error){
			createdLog(error, skinPath('default/scss'));
		});
		mkdirp(skinPath('default/images'), function(error){
			createdLog(error, skinPath('default/images'));
		});
		mkdirp(skinPath('default/css'), function(error){
			createdLog(error, skinPath('default/css'));
		});
		mkdirp(skinPath('default/js'), function(error){
			createdLog(error, skinPath('default/js'));
		});
		mkdirp(skinPath('default/js/vendor'), function(error){
			createdLog(error, skinPath('default/js/vendor'));
		});
		mkdirp(skinPath('default/js/main'), function(error){
			createdLog(error, skinPath('default/js/main'));
		});

		// app design dirs
		mkdirp(designPath(), function(error){
			createdLog(error, designPath('default/js/main'));
		});
		mkdirp(designPath('default'), function(error){
			createdLog(error, designPath('default'));
		});
	},
	createFiles: function(cwd) {
		// scss
		for (var key in settings.fileAndDirs.scss) {
			mkdirp(skinPath('default/scss/' + key), function(error){
				createdLog(error, skinPath('default/scss/' + key));
			});

			settings.fileAndDirs.scss[key].forEach(function(data){
				fs.writeFile(skinPath('default/scss/' + key + '/' + data), null, function(error){
					createdLog(error, skinPath('default/scss/' + key + '/' + data));
				});
			});
		}

		fse.copy(__dirname + '/templates/_bower.temp.json', 'bower.json', function(error){
			createdLog(error, 'bower.json');
		});
		fse.copy(__dirname + '/templates/_gulpfile.temp.js', 'gulpfile.js', function(error){
			createdLog(error, 'gulp.js');
		});
	},
	init: function(cwd) {
		var ght_ = this;
		var when = require("node-promise").when;
		when(this.createEmptyDirectories(), function(){
			ght_.createFiles(cwd);
		});
	}
};