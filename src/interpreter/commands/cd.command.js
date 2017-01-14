const command = require('../command');

module.exports = command('cd')
	.arguments('<path>')
	.action(() => {
		console.log(arguments);
	});
