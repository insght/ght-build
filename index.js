'use strict';

// modules
var fs			= require('fs');
var fse 		= require('fs-extra');
var path		= require('path');
var prompt		= require('prompt');
var replace 	= require("replace");
var promise		= require('node-promise');
var mkdirp		= require('mkdirp');
var ghtConf		= require('./app/ght.schema.js');

var defer		= promise.defer;
var deferred	= defer();

var log = function(error, dir) {
	if(!error) return console.log(dir + ' - Created!');
	return console.log('error: ' + error);
};

var ght = {
	packageName: '', themeName: '',
	replaceString: function(regex, replacement, files) {
		replace({regex: regex, replacement: replacement, paths: files, recursive: false, silent: true});
	},
	rmdir : function(dir) {
		var list = fs.readdirSync(dir);
		for (var i = 0; i < list.length; i++) {
			var filename = path.join(dir, list[i]);
			var stat = fs.statSync(filename);

			if (filename == "." || filename == "..") {
			} else if (stat.isDirectory()) {
				rmdir(filename);
			} else {
				fs.unlinkSync(filename);
			}
		}
		fs.rmdirSync(dir);
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

	componentList: ['bower', 'compass', 'gulp'],
	component: function(name){
		var component = require('./app/components/' + name + '.js');
		return component.init(this);
	}
};

module.exports = ght;