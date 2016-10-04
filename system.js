const Process = require('./Process');

const commandExists = require('command-exists');
const spawn = require('child_process').spawn;
const Highland = require('highland');

module.exports = function (context) {

	return new Proxy(context,
		{
			/**
			* Runs system command
			* @returns {Process}
			*/
			get: function (target, name) {
				if (target[name]) {
					return target[name];
				}

				//TODO: Add error stream connectors
				return function (args) {
					let appProcess = new Process();
					let systemProcess = spawn(name, (args)? args.split(' '): []);


					systemProcess.stdout.pipe(appProcess.stdout);

					appProcess.stdin.pipe(systemProcess.stdin);

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

			},
			set: function (target, name, value) {
				target[name] = value;
			}
		}
	);
};
