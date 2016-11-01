const Highland		= require('highland');
const fs			= require('fs');
const readdir		= Highland.wrapCallback(fs.readdir);
const spawn			= require('child_process').spawn;

const StateMachine	= require('./shared/StateMachine');
const Process		= require('./Process');

module.exports = {
	getInstance() {
		let context = {
			stdout: new Highland(),
			status: new StateMachine({
				initial: 'unloaded',
				states: {
					unloaded: ['loaded']
				}
			}),
			system: {
				$env: process.env
			}
		};

		//TODO: System command outputs id:3
		//TODO: Change system file to global context file id:4
		(new Highland(
				//TODO: Check windows support id:5
				context.system.$env.PATH.split(':')
			))
			.map((path) => readdir(path)
				.errors(() => {}) //TODO: Do something with these errors id:6
			)
			.flatten()
			.uniq()
			.each((command) => {
				context.system[command] = function(...args) {
					//TODO: Add error propagation to backend id:7
					let systemProcess = spawn(command, (args)? args: []);

					let appProcess = new Process((push, next, input) => {
						systemProcess.stdout.on('data',
							(data) => {
								push(null, data);
							}
						);

						systemProcess.stderr.on('data',
							(err) => {
								push(new Error(err), null);
							}
						);

						input.pipe(systemProcess.stdin);
					});

					systemProcess.stdout.on('end',
						() => appProcess.stdout.end()
					);

					appProcess.defaultOutput(context.stdout);

					return appProcess;
				};
			})
			.errors((err) => console.error(err))
			.done(() => context.status.go('loaded'));

			return context;
	}
};
