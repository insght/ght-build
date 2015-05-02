/** ght-build alpha */
var fs = require('fs');

module.exports = function() {
	var exec = require('child_process').exec;

	fs.readFile('ght-project.json', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		var dataJSON  = JSON.parse(data);
		var themeName = dataJSON.name;

		exec('mkdir skin/frontend/' + themeName, function (err, stdout, stderr) {
			if (err) {
				return console.log(err);
			}

			exec('mkdir skin/frontend/' + themeName + '/default', function (err, stdout, stderr) {
				if (err) {
					return console.log(err);
				}

				console.log(stdout);
			});

			console.log(stdout);
		});
	});
}