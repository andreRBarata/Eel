module.exports = function(interpreter) {
	let spawn = require('child_process').spawn;

	interpreter.catch()
	 	.action((args, environment, cb) => {
			let process = spawn(args[0], args.slice(1), environment);

			return process.
		});
};
