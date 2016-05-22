module.exports = function (interpreter) {
	var ansiUp = require('ansi_up');
	var spawn = require('child_process').spawn;

	 interpreter.catch('<command> [options] [strings...]')
	 	.action((args, cb) => {
			console.log(args.command, args.options, args);
			var process = spawn(args.command, args.options);


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
}
