var exec = require('child_process').exec;
var fse  = require('fs-extra');

var BowerComponent = {
	ght: null,
	commands: {
		installGlobal: 'npm install -g bower --save-dev',
		bowerInstall: 'bower install',
		bowerUpdate: 'bower update'
	},
	init: function (ght) {
		this.ght = ght;
		return this;
	},
	installation: function() {
		var ght		= this.ght;
		var when	= require('node-promise').when;

		exec(this.commands.installGlobal, installBower);
		function installBower(error, stdout, stderr) {
			console.log(stdout);

			var bowerTemplate = ght.templatePath('_bower.json.temp');
			var bowerDist	  = ght.skinPath('bower.json');
			var filesCreated = 0;

			fse.copy(bowerTemplate, bowerDist, bowerCopyCallback);
			function bowerCopyCallback() {
				ght.replaceString('{project_name}', ght.packageName, [bowerDist]);
				filesCreated += 1;
			}

			var bowerrcTemplate = ght.templatePath('.bowerrc.temp');
			var bowerrcDist		= ght.skinPath('.bowerrc');

			fse.copy(bowerrcTemplate, bowerrcDist, bowerrcCopyCallback);
			function bowerrcCopyCallback() {
				ght.replaceString('{project_name}', ght.packageName, [bowerrcDist]);
				filesCreated += 1;
			}

			when(filesCreated, function(){
				exec('cd ' + ght.skinPath('') + ' && bower install', console.log);
			});
		}
	}
};

module.exports = BowerComponent;