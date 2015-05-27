var exec 	 = require('child_process').exec,
 	fse  	 = require('fs-extra'),
 	defer	 = require('node-promise').defer;


 var deferred   = defer(),
 	 ghtConf	= require('../ght.schema.js');


var MagentoComponent = {
	ght: null,
	commands: { 
	},
	init: function(ght) {
		this.ght = ght;
		return this;
	},
	frontendThemeDirs: function(preProcessor) {
		 var _this = this;
		 var ght   = this.ght;
		// design directories
		var magento19DesignSchema = ghtConf.themeSchema.magento19.design;
		magento19DesignSchema.forEach(function(dir, index){
			ght.mkdir(ght.designPath(dir));

			if(dir === 'layout') {
				var localTemplate = ght.templatePath('local.xml.temp');
				var localDist     = ght.designPath('layout/local.xml');
				fse.copy(localTemplate, localDist, function(e, b, c){
					console.log(e, b, c);
				});
			}
		});

		// skin directories
		var magento19SkinSchema = ghtConf.themeSchema.magento19.skin;
		magento19SkinSchema.forEach(function(dir, index){
			ght.mkdir(ght.skinPath(dir));
		});

		var preProcessorSchema = ghtConf.themeSchema.preProcessor[preProcessor];
		preProcessorSchema.forEach(function(dir, index){
		ght.mkdir(ght.skinPath(dir));
			if(index === (preProcessorSchema.length - 1)) {
				deferred.resolve('finished');
			}
		});
		
		return deferred.promise;
	}
};

module.exports = MagentoComponent;