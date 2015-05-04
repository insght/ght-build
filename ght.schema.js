module.exports = {
	ghtThemeSchema: {
		'magento19': {
			design: [
				'etc',
				'layout',
				'template'
			],
			skin: [
				'css',
				'images',
				'images/sprites',
				'js',
				'js/main',
				'js/vendor',
				'scss',
				'scss/content',
				'scss/layout',
				'scss/mixins',
				'scss/sprites'
			]
		},
		'magento2': {}
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
	}, {
		description: "What you will use on your project? (less or sass)",
		name: 'pre_processor',
		default: 'sass',
		hidden: false,
		required: true
	}]
};