module.exports = function(interpreter) {
	interpreter.command('cd <path>')
		//And error detection on the cd
		.action((args, environment, cb) => {
			var path = require('path');

			environment.cwd = path.resolve(environment.cwd, args.path);
		});
};
