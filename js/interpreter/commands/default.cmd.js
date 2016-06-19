module.exports = function(interpreter) {
	var ansiUp = require('ansi_up');
	var spawn = require('child_process').spawn;

	interpreter.catch()
	 	.action((args, environment, cb) => {
			var process = spawn(args[0], args.slice(1), environment);

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
