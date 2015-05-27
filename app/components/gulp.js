var exec = require('child_process').exec;
var fse  = require('fs-extra');

var GulpComponent = {
	ght: null,
	commands: {
		installGlobal:	'npm install -g gulp',
		installLocal:	'npm install gulp',
		gulpDev:		'gulp dev',
		gulpProd:		'gulp prod'
	},
	init: function(ght) {
		this.ght = ght;
		return this;
	},
	installation: function() {
		var ght = this.ght;
		var when = require('node-promise').when;

		exec(this.commands.installGlobal, installGlobal);
		function installGlobal(error, stdout, stderr) {
			var packageTemplate	 = ght.templatePath('package.json.temp');
			var packageDist		 = ght.skinPath('package.json');

			fse.copy(packageTemplate,packageDist, copyCallback);
			function copyCallback(error) {
				ght.replaceString('{project_name}', ght.packageName, [packageDist]);

				exec('cd ' + ght.skinPath('') + ' && npm install', installDependencies);
				function installDependencies(){
					console.log(stdout);

					var gulpTemplate = ght.templatePath('_gulpfile.js.temp');
					var gulpDist     = ght.skinPath('gulpfile.js');

					fse.copy(gulpTemplate, gulpDist, function(e, b, c){
						console.log(e, b, c);

						exec('cd ' + ght.skinPath('') + ' && gulp init-project');
					});
				}
			}
		}
	}
};

module.exports = GulpComponent;