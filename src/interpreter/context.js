const Highland		= require('highland');
const fs			= require('fs');
const readdir		= Highland.wrapCallback(fs.readdir);
const spawn			= require('child_process').spawn;
const stream		= require('stream');


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
				$env: process.env,
				writeFile(file) {
					return new Process((push, emit, input) => {
						input.pipe(fs.WriteStream(file));
					});
				},
				'_' : Process
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
			.filter((command) => !context.system[command])
			.each((command) => {
				context.system[command] = function(...args) {
					let appProcess = new Process((push, emit, input) => {
						//TODO: Fix error propagation to backend id:7
						let systemProcess = spawn(command, (args)? args: []);

						systemProcess.stdout.on('data',
							(data) => push(data)
						);

						systemProcess.stderr.on('data',
							(err) => emit('error', err)
						);

						input.pipe(systemProcess.stdin);
					}, {
						defaultOutput: context.stdout,
						$env: context.system.$env
					});

					return appProcess;
				};
			})
			.errors((err) => console.error(err))
			.done(() => context.status.go('loaded'));

			return context;
	}
};
