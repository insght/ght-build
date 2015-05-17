var exec = require('child_process').exec;
var fse  = require('fs-extra');

var CompassComponent = {
	ght: null,
	commands: {
		installGlobal: 'gem install compass',
		compassCreate: 'compass create '
	},
	init: function (ght) {
		this.ght = ght;
		return this;
	},
	installation: function() {
		var _this = this;
		var ght   = this.ght;

		exec(this.commands.installGlobal, installGlobalCallback);
		function installGlobalCallback(error, stdout, stderr) {
			console.log(stdout, stderr, error);

			exec(_this.commands.compassCreate + ght.skinPath(''), compassCreateCallback);
			function compassCreateCallback() {
				ght.rmdir(ght.skinPath('stylesheets'));
				ght.rmdir(ght.skinPath('sass'));

				var configRb = ght.skinPath('config.rb');
				ght.replaceString('"stylesheets"', '"css"', [configRb]);
				ght.replaceString('"sass"', '"scss"', [configRb]);
				ght.replaceString('"/"', '"/' + ght.skinPath('') + '"',[configRb]);

				var stylesTemplate = ght.templatePath('styles.scss.temp');
				var stylesDist     = ght.skinPath('scss/styles.scss');
				fse.copy(stylesTemplate, stylesDist, console.log);
			}
		}
	}
};

module.exports = CompassComponent;