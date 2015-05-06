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
var ghtConf		= require('./app/ght.schema.js');
var when		= promise.when;

var defer		= promise.defer;
var deferred	= defer();

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
	packageName: '', themeName: '',
	replaceString: function(regex, replacement, files) {
		replace({regex: regex, replacement: replacement, paths: files, recursive: false, silent: true});
	},
	skinPath: function(additional) {
		return 'skin/frontend/'
			+ this.packageName
			+ '/' + this.themeName
			+ '/' + additional;
	},
	designPath: function(additional) {
		return 'app/design/frontend/'
			+ this.packageName
			+ '/' + this.themeName
			+ '/' + additional;
	},
	cwdPath: function(type, additional) {
		var cwd	 = this[type + 'Path'];

		return cwd(additional);
	},
	templatePath: function(templatename) {
		return __dirname + '/app/templates/' + templatename;
	},
	createDirectories: function() {
		var _this = this;
		// design directories
		var magento19DesignSchema = ghtConf.themeSchema.magento19.design;
		magento19DesignSchema.forEach(function(dir, index){
			mkdirp(_this.designPath(dir),function(error){
				log(error, ght.designPath(dir));
			});
		});

		// skin directories
		var magento19SkinSchema = ghtConf.themeSchema.magento19.skin;
		magento19SkinSchema.forEach(function(dir, index){
			mkdirp(_this.skinPath(dir),function(error){
				log(error, ght.skinPath(dir));

				if(index == (magento19SkinSchema.length-1)) {
					deferred.resolve('Finish');
				}
			});
		});
		return deferred.promise;
	},
	components: {
		bower: function() {
			var _this = ght;

			exec('npm install bower -g --save-dev', function (error, stdout, stderr) {
				console.log(stdout);

				var filesCreated = 0;
				fse.copy(
					_this.templatePath('_bower.json.temp'),
					_this.skinPath('bower.json'),
					function(error){
						log(error, 'bower.json');
						ght.replaceString('{project_name}', _this.packageName, [_this.skinPath('bower.json')]);

						filesCreated += 1;
					}
				);

				fse.copy(
					_this.templatePath('.bowerrc.temp'),
					_this.skinPath('.bowerrc'),
					function(error){
						log(error, '.bowerrc');
						_this.replaceString('{project_name}', _this.packageName, [_this.skinPath('.bowerrc')]);

						filesCreated += 1;
					}
				);

				when(filesCreated, function(){
					exec('cd ' + _this.skinPath('') + ' && bower install', function (error, stdout, stderr) {
						console.log(stdout);
					});
				});
			});
		},
		gulp: function() {
			var _this = ght,
				 when = promise.when;
			exec('npm install gulp -g --save-dev', function (error, stdout, stderr) {
				console.log(stdout);

				when(fse.copy(
					_this.templatePath('package.json.temp'),
					_this.skinPath('package.json'),
					function(error){
						log(error, 'package.json');
						_this.replaceString('{project_name}', _this.packageName, [_this.skinPath('package.json')]);
					}
				),function(){
					exec('cd ' + ght.skinPath('') + ' && npm install', function (error, stdout, stderr) {
						console.log(stdout);

						fse.copy(
							_this.templatePath('_gulpfile.js.temp'),
							_this.skinPath('gulpfile.js'),
							function(error){
								log(error, 'gulpfile.js');
							}
						);
					});
				});
			});
		},
		susy: function() {
			exec('gem install susy', function (error, stdout, stderr) {
				console.log(stdout);
			});
		},
		compass: function() {
			var _this = ght;
			exec('gem install compass', function (error, stdout, stderr) {
				console.log(stdout, stderr, error);

				exec('compass create ' + _this.skinPath(''), function (error, stdout, stderr) {
					rmdir(_this.skinPath('stylesheets'));
					rmdir(_this.skinPath('sass'));

					_this.replaceString('"stylesheets"', '"css"', [_this.skinPath('config.rb')]);
					_this.replaceString('"sass"', '"scss"', [_this.skinPath('config.rb')]);
					_this.replaceString(
						'"/"', '"/'+_this.skinPath('')+'"',
						[_this.skinPath('config.rb')]
					);

					fse.copy(
						_this.templatePath('styles.scss.temp'),
						_this.skinPath('scss/styles.scss'),
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