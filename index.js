/** ght-build alpha */
var fs		= require('fs');
var path	= require('path');
var mkdirp	= require('mkdirp');
var exec	= require('child_process').exec;
var settings = JSON.parse(
	fs.readFileSync(
		path.resolve(
			__dirname,
			'ght-project.json'
		),
		'utf8'
	)
);

module.exports = function() {
	var themeName = settings.name;
	settings.fileAndDirs.forEach(function(data){
		console.log(data);
	});
	mkdirp('skin/frontend/' + themeName, function(err) {
		mkdirp('skin/frontend/' + themeName + '/default', function(err) {

		});
	});
};