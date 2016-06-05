module.exports = function(commander) {
	var ansiUp = require('ansi_up');
	var spawn = require('child_process').spawn;

	 commander.catch()
	 	.action((args, cb) => {
			var process = spawn(args[0], args.slice(1));

			process.stdout.on('data', (data) => {
				cb(
					ansiUp.ansi_to_html(
						ansiUp.escape_for_html(`${data}`),
						{
							'use_classes': true
						}
					).replace(new RegExp('\n', 'g'), '<br/>')
				);
			});
		});
};
