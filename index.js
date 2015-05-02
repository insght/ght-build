/** ght-build alpha */
var fs		= require('fs');
var mkdirp	= require('mkdirp');
var exec	= require('child_process').exec;
var settings =
	JSON.parse(
		require('fs').readFileSync(
			require('path').resolve(
				__dirname,
				'ght-project.json'),
			'utf8'));

module.exports = function() {


		var dataJSON  = settings;
		var themeName = dataJSON.name;

		mkdirp('skin/frontend/' + themeName, function(err) {
			mkdirp('skin/frontend/' + themeName + '/default', function(err) {
			});
		});

}