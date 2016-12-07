const Highland		= require('highland');
const fs			= require('fs');
const readdir		= Highland.wrapCallback(fs.readdir);
const spawn			= require('child_process').spawn;

const StateMachine	= require('./shared/StateMachine');
const Process		= require('./Process');

//TODO: Create tests for loadSystem and generateSystemFunction
let ContextGenerator = {
	loadSystem(path) {
		//TODO:140 System command outputs id:3
		//TODO:60 Change system file to global context file id:4
		return new Highland(
			path
		)
		.map((path) => readdir(path)
			.errors(() => {}) //#ForThisSprint:20 Do something with these errors id:6
		)
		.flatten()
		.uniq();
	},
	generateSystemFunction(command, options) {
		return function(...args) {
			let appProcess = new Process((push, emit, input) => {
				//TODO:100 Fix error propagation to backend id:7
				let systemProcess = spawn(command, (args)? args: []);

				(new Highland(systemProcess.stdout))
					.splitBy(/([^\n]+\n)/)
					.filter((line) => line !== '')
					.each(push);

				systemProcess.stdin.on('end', () => {
					appProcess.end();
				});

				systemProcess.stderr.on('readable',
					() => push(systemProcess.stderr.read())
				);

				input.pipe(systemProcess.stdin);
			}, options);

			return appProcess;
		};
	},
	getInstance() {
		let context = Object.assign(
			new StateMachine({
				initial: 'unloaded',
				states: {
					unloaded: ['loaded']
				}
			}), {
				stdout: new Highland(),
				$env: process.env,
				writeFile(file) {
					return fs.WriteStream(file);
				},
				map(cb) {
					return (new Highland()).map(cb);
				},
				reduce(cb) {
					return (new Highland()).reduce(cb);
				},
				filter(cb) {
					return (new Highland()).filter(cb);
				},
				'_' : Process
			}
		);

		//TODO:70 Check windows support id:5
		ContextGenerator
			.loadSystem(context.$env.PATH.split(':'))
			.each((command) => {
				context[command] = ContextGenerator
					.generateSystemFunction(command, {
						defaultOutput: context.stdout
					});
			})
			.errors((err) => console.error(err))
			.done(() => {
				context.go('loaded');
			});

		return context;
	}
};

module.exports = ContextGenerator;
