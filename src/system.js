const Process	= require('./Process');

const Highland	= require('highland');
const fs		= require('fs');
const readdir	= Highland.wrapCallback(fs.readdir);
const spawn 	= require('child_process').spawn;


//#Done:10 Add check to see if command exists
module.exports = function (context) {
	if (!context.$env) {
		context.$env = {
			PATH: ''
		};
	}

	(new Highland(
		context.$env.PATH.split(':')
	))
	.map((path) => readdir(path)
		.errors(() => {}) //TODO:10 Do something with these errors
	)
	.flatten()
	.filter((command) => !context[command])
	.each((command) => Object.defineProperty(context, command, {
		get: function() {
			return function (args) {
				let appProcess = new Process();
				let systemProcess = spawn(command, (args)? args.split(' '): []);

				systemProcess.stdout.pipe(appProcess.stdout);

				appProcess.stdin.pipe(systemProcess.stdin);

				//TODO:20 Add error propagation to backend
				(new Highland(systemProcess.stderr))
					.map((err) => Highland.fromError(err))
					.merge().pipe(appProcess.stdout, {end: false});

				systemProcess.on('error',
					(err) => Highland
						.fromError(err)
						.pipe(appProcess.stdout, {end: false})
				);

				return appProcess;
			};
		}}
	));

	return context;
};
