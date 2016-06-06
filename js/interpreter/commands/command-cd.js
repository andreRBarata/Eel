module.exports = function(interpreter) {
	interpreter.command('cd <path>', 'Set the current working directory')
		//Add error detection on the cd and add ~ syntax
		.action((args, environment, cb) => {
			var path = require('path');

			environment.cwd = path.resolve(environment.cwd, args.path);
		});
};
