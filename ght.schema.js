module.exports = {
	ghtThemeSchema: {
		'magento19': {
			design: [
				'default',
				'default/etc',
				'default/layout',
				'default/template'
			],
			skin: [
				'default',
				'default/css',
				'default/images',
				'default/images/sprites',
				'default/js',
				'default/js/main',
				'default/js/vendor',
				'default/scss',
				'default/scss/content',
				'default/scss/layout',
				'default/scss/mixins',
				'default/scss/sprites'
			]
		}
	},
	promptProperties: [{
		description: "Install or update Gulp? (yes or no)",
		name: 'gulp',
		default: 'yes',
		required: true,
		hidden: false
	}, {
		description: "Install or update Bower? (yes or no)",
		name: 'bower',
		default: 'yes',
		hidden: false,
		required: true
	}, {
		description: "Install or update Susy? (yes or no)",
		name: 'susy',
		default: 'yes',
		hidden: false,
		required: true
	}, {
		description: "Install or update Compass? (yes or no)",
		name: 'compass',
		default: 'yes',
		hidden: false,
		required: true
	}]
};