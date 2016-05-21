var ansiUp = require('ansi_up');
var spawn = require('child_process').spawn;

module.exports = function(vorpal) {
	vorpal.catch('<command> [options] [strings...]')
		.action((args, cb) => {
			var process = spawn(args.command, args.options);

			console.log(args.command, args.options, args);
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
		})
		.hidden();
}
