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
var when		= promise.when;

var defer		= promise.defer;
var deferred	= defer();

// app
var settings = JSON.parse(fs.readFileSync('ght-project.json','utf8'));

var log = function(error, dir) {
	if(!error) return console.log(dir + ' - Created!');
	return console.log('error: ' + error);
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

var ght = {
	replaceString: function(regex, replacement, files) {
		replace({regex: regex, replacement: replacement, paths: files, recursive: false, silent: true});
	},
	skinPath: function(additional) {
		return 'skin/frontend/'
			+ settings.package
			+ '/' + settings.theme
			+ '/' + additional;
	},
	designPath: function(additional) {
		return 'app/design/frontend/'
			+ settings.package
			+ '/' + settings.theme
			+ '/' + additional;
	},
	cwdPath: function(type, additional) {
		var _ght = this;
		var cwd	 = _ght[type + 'Path'];

		return cwd(additional);
	},
	templatePath: function(templatename) {
		return __dirname + '/templates/' + templatename;
	},
	createDirectories: function() {
		// skin dir
		mkdirp(ght.skinPath('/'), function(error){
			log(error, ght.skinPath(''));
		});

		var magento19SkinSchema = ghtConf.ghtThemeSchema.magento19.skin;
		magento19SkinSchema.forEach(function(dir, index){
			mkdirp(ght.skinPath(dir),function(error){
				log(error, ght.skinPath(dir));
			});
		});

		// app design dirs
		mkdirp(ght.designPath('/'), function(error){
			log(error, ght.designPath(''));
		});

		var magento19DesignSchema = ghtConf.ghtThemeSchema.magento19.design;
		magento19DesignSchema.forEach(function(dir, index){
			mkdirp(ght.designPath(dir),function(error){
				log(error, ght.designPath(dir));

				if(index == (magento19DesignSchema.length-1)) {
					deferred.resolve('Finish');
				}
			});
		});

		return deferred.promise;
	},
	components: {
		bower: function() {
			exec('npm install bower -g --save-dev', function (error, stdout, stderr) {
				console.log(stdout);

				var filesCreated = 0;
				fse.copy(
					ght.templatePath('_bower.json.temp'),
					ght.cwdPath('skin', 'bower.json'),
					function(error){
						log(error, 'bower.json');
						ght.replaceString('{project_name}', settings.name, [ght.cwdPath('skin', 'bower.json')]);

						filesCreated += 1;
					}
				);

				fse.copy(
					ght.templatePath('.bowerrc.temp'),
					ght.cwdPath('skin', '.bowerrc'),
					function(error){
						log(error, '.bowerrc');
						ght.replaceString('{project_name}', settings.name, [ght.cwdPath('skin', '.bowerrc')]);

						filesCreated += 1;
					}
				);

				when(filesCreated, function(){
					exec('cd ' + ght.cwdPath('skin', '') + ' && bower install', function (error, stdout, stderr) {
						console.log(stdout);
					});
				});
			});
		},
		gulp: function() {
			exec('npm install gulp -g --save-dev', function (error, stdout, stderr) {
				console.log(stdout);

				exec('cd ' + ght.cwdPath('skin', '') + ' && npm install gulp --save-dev', function (error, stdout, stderr) {
					console.log(stdout);

					fse.copy(
						ght.templatePath('_gulpfile.js.temp'),
						ght.cwdPath('skin', 'gulpfile.js'),
						function(error){
							log(error, 'gulpfile.js');
						}
					);
				});
			});
		},
		susy: function() {
			exec('gem install susy', function (error, stdout, stderr) {
				console.log(stdout);
			});
		},
		compass: function() {
			exec('gem install compass', function (error, stdout, stderr) {
				console.log(stdout, stderr, error);

				exec('compass create ' + ght.cwdPath('skin', ''), function (error, stdout, stderr) {
					rmdir(ght.cwdPath('skin', 'stylesheets'));
					rmdir(ght.cwdPath('skin', 'sass'));

					fse.copy(
						ght.templatePath('styles.scss.temp'),
						ght.cwdPath('skin', 'scss/styles.scss'),
						function(error){
							log(error, 'styles.scss');
						}
					);
				});
			});
		}
	}
};

module.exports = ght;