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
		mkdirp(skinPath(''), function(error){
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
		mkdirp(designPath(''), function(error){
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

		fse.copy(__dirname + '/templates/_bower.json.temp', 'bower.json', function(error){
			createdLog(error, 'bower.json');
			replaceStr('{project_name}', settings.name, ['bower.json']);
		});

		fse.copy(__dirname + '/templates/.bowerrc.temp', '.bowerrc', function(error){
			createdLog(error, '.bowerrc');
			replaceStr('{project_name}', settings.name, ['.bowerrc']);
		});

		fse.copy(__dirname + '/templates/_gulpfile.js.temp', 'gulpfile.js', function(error){
			createdLog(error, 'gulpfile.js');
			deferred.resolve('Creating files finished');
		});

	},
	init: function(cwd) {
		this.createEmptyDirectories();
		this.createFiles(cwd);

		var when = promise.when;
		when(deferred.promise, function() {
			prompt.start();
			var prompts = [{
				description: "Install Gulp? (yes or no)",
				name: 'gulp',
				default: 'yes',
				required: true,
				hidden: false
			}, {
				description: "Install Bower? (yes or no)",
				name: 'bower',
				default: 'yes',
				hidden: false,
				required: true
			}, {
				description: "Install Susy? (yes or no)",
				name: 'susy',
				default: 'yes',
				hidden: false,
				required: true
			}];

			prompt.get(prompts, function (error,  props) {
				var gulp	= props.gulp;
				var bower	= props.bower;
				var susy	= props.susy;

				if(bower == 'yes') {
					console.log('Starting for install bower package');
					exec('npm install bower -g --save-dev', function (error, stdout, stderr) {
						console.log(stdout);

						exec('cd '  + process.cwd() + '/' + skinPath('default'), function (error, stdout, stderr) {
							console.log(stdout);

							exec('bower install', function (error, stdout, stderr) {
								console.log(stdout);
							});
						});


					});
				}

				if(gulp == 'yes') {
					console.log('Starting for install gulp package');
					exec('npm install gulp -g --save-dev', function (error, stdout, stderr) {
						console.log(stdout);
						exec('npm install gulp --save-dev', function (error, stdout, stderr) {
							console.log(stdout);
						});
					});
				}

				if(susy == 'yes') {
					console.log('Starting for install susy');
					exec('gem install susy', function (error, stdout, stderr) {
						console.log(stdout);
					});
				}

				console.log('Starting for install compass');
				exec('gem install compass', function (error, stdout, stderr) {
					console.log(stdout, stderr, error);

					exec('compass create ' + process.cwd() + '/' + skinPath('default'), function (error, stdout, stderr) {
						rmdir(process.cwd() + '/' + skinPath('default/stylesheets'));
						rmdir(process.cwd() + '/' + skinPath('default/sass'));

						fse.copy(__dirname + '/templates/styles.scss.temp', process.cwd() + '/' + skinPath('default/sass/')  + 'styles.scss', function(error){
							createdLog(error, 'styles.scss');
						});
					});
				});
			});
		});
	}
};