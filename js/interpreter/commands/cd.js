module.exports = function(interpreter) {
	interpreter.command('cd <path>', 'Set the current working directory')
		//And error detection on the cd
		.action((args, environment, cb) => {
			var path = require('path');

			environment.cwd = path.resolve(environment.cwd, args.path);
		});
};
