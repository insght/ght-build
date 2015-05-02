/** ght-build alpha */
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function() {
	var exec = require('child_process').exec;

	fs.readFile('ght-project.json', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		var dataJSON  = JSON.parse(data);
		var themeName = dataJSON.name;

		mkdirp('skin/frontend/' + themeName, function(err) {

			// path was created unless there was error
			mkdirp('skin/frontend/' + themeName + '/default', function(err) {

				// path was created unless there was error

			});
		});
	});
}