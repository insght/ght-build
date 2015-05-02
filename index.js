/** ght-build alpha */
var fs = require('fs');

module.exports = function() {
	fs.readFile('ght-project.json', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		console.log(data);
	});
}