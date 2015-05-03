'use strict';

// modules
var fs			= require('fs');
var fse 		= require('fs-extra');
var path		= require('path');
var prompt		= require('prompt');
var replace 	= require("replace");
var promise		= require('node-promise');
var mkdirp		= require('mkdirp');
var exec		= require('child_process').exec;
var ghtConf		= require('./ght.schema.js');

var defer		= promise.defer;
var deferred	= defer();

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

var replaceStr = function(regex, replacement, files) {
	replace({regex: regex, replacement: replacement, paths: files, recursive: false, silent: true});
};

var rmdir = function(dir) {
	var list = fs.readdirSync(dir);
	for(var i = 0; i < list.length; i++) {
		var filename = path.join(dir, list[i]);
		var stat = fs.statSync(filename);

		if(filename == "." || filename == "..") {
		} else if(stat.isDirectory()) {
			rmdir(filename);
		} else {
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dir);
};

module.exports = {
	createEmptyDirectories: function(){
		// skin dir
		mkdirp(skinPath('/'), function(error){
			createdLog(error, skinPath(''));
		});

		var magento19SkinSchema = ghtConf.ghtThemeSchema.magento19.skin;
		magento19SkinSchema.forEach(function(dir, index){
			mkdirp(skinPath(dir),function(error){
				createdLog(error, skinPath(dir));
			});
		});

		// app design dirs
		mkdirp(designPath('/'), function(error){
			createdLog(error, designPath(''));
		});

		var magento19DesignSchema = ghtConf.ghtThemeSchema.magento19.design;
		magento19DesignSchema.forEach(function(dir, index){
			mkdirp(designPath(dir),function(error){
				createdLog(error, skinPath(dir));

				if(index == (magento19DesignSchema.length-1)) {
					deferred.resolve('Finish');
				}
			});
		});
	},
	init: function(cwd) {
		this.createEmptyDirectories();

		var skin_path = process.cwd() + '/' + skinPath('default');

		var when = promise.when;
		when(deferred.promise, function() {
			prompt.start();

			var prompts = ghtConf.promptProperties;
			prompt.get(prompts, function (error,  props) {
				var gulp	= props.gulp;
				var bower	= props.bower;
				var susy	= props.susy;
				var compass	= props.compass;

				if(bower == 'yes') {
					console.log('Starting for install bower package');
					exec('npm install bower -g --save-dev', function (error, stdout, stderr) {
						console.log(stdout);

						var filesCreated = 0;
						fse.copy(__dirname + '/templates/_bower.json.temp', skin_path + '/bower.json', function(error){
							createdLog(error, 'bower.json');
							replaceStr('{project_name}', settings.name, [skin_path + '/bower.json']);

							filesCreated+=1;
						});

						fse.copy(__dirname + '/templates/.bowerrc.temp', skin_path + '/.bowerrc', function(error){
							createdLog(error, '.bowerrc');
							replaceStr('{project_name}', settings.name, [skin_path + '/.bowerrc']);
							filesCreated+=1;
						});

						when(filesCreated, function(){
							exec('cd '+skin_path+' && bower install', function (error, stdout, stderr) {
								console.log(stdout);
							});
						});
					});
				} else {
					console.log('bower installation - no');
				}

				if(gulp == 'yes') {
					console.log('Starting for install gulp package');
					exec('npm install gulp -g --save-dev', function (error, stdout, stderr) {
						console.log(stdout);
						exec('cd '+skin_path+' && npm install gulp --save-dev', function (error, stdout, stderr) {
							console.log(stdout);

							fse.copy(__dirname + '/templates/_gulpfile.js.temp', skin_path + '/gulpfile.js', function(error){
								createdLog(error, 'gulpfile.js');
							});
						});
					});
				} else {
					console.log('gulp installation - no');
				}

				if(susy == 'yes') {
					console.log('Starting for install susy');
					exec('gem install susy', function (error, stdout, stderr) {
						console.log(stdout);
					});
				} else {
					console.log('susy installation - no');
				}

				if(compass == 'yes') {
					console.log('Starting for install compass');
					exec('gem install compass', function (error, stdout, stderr) {
						console.log(stdout, stderr, error);

						exec('compass create ' + process.cwd() + '/' + skinPath('default'), function (error, stdout, stderr) {
							rmdir(skin_path + '/stylesheets');
							rmdir(skin_path + '/sass');

							fse.copy(__dirname + '/templates/styles.scss.temp',skin_path + '/scss/styles.scss', function(error){
								createdLog(error, 'styles.scss');
							});
						});
					});
				} else {
					console.log('compass installation - no');
				}
			});
		});
	}
};