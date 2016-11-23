module.exports = function(interpreter = require('./interpreter')) {
	interpreter.command('cd <path>', 'Sets the current working directory')
		.action((args, environment, cb) => {
			let path = require('path');

			environment.cwd = path.resolve(environment.cwd, args.path);
		});
};
