'use strict';

// modules
var fs		= require('fs'), 
	fse 	= require('fs-extra'), 
	path	= require('path');
 	prompt	= require('prompt'),
 	replace = require("replace"),
 	promise	= require('node-promise'),
 	mkdirp	= require('mkdirp'),
 	ghtConf	= require('./app/ght.schema.js');

var defer	 = promise.defer;
var deferred = defer();
var console	 = require('logbrok')({ title: 'Ght Generator', log_level: 'warn', color: true });

var ght = {
	packageName : '', 
	themeName	: '',
	replaceString: function(regex, replacement, files) {
		replace({regex: regex, replacement: replacement, paths: files, recursive: false, silent: true});
	},
	mkdir: function(dir) {
		mkdirp(dir,function(error){
			if(error) {
				console.error('Error create directory: ', dir, error);
				return;
			}
			console.info('Directory created: ', dir);
		});
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
			ght.mkdir(_this.designPath(dir));
		});

		// skin directories
		var magento19SkinSchema = ghtConf.themeSchema.magento19.skin;
		magento19SkinSchema.forEach(function(dir, index){
			ght.mkdir(_this.designPath(dir));

			if(index == (magento19SkinSchema.length-1)) {
				deferred.resolve('Finish');
			}
		});
		return deferred.promise;
	},
	component: function(name){
		var component = require('./app/components/' + name + '.js');
		return component.init(this);
	}
};

module.exports = ght;