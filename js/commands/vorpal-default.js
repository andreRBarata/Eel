var Convert = require('ansi-to-html');
var convert = new Convert();

module.exports = function(vorpal) {
	vorpal.catch('<command>[params...]')
		.action((args, cb) => {
			var spawn = require('child_process').spawn;
			var process = spawn(args.command, args.params);

			process.stdout.on('data', (data) => {
				cb(convert.toHtml(`${data}`));
				console.log(convert.toHtml(`${data}`));
			});
		});
}
