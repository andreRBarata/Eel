const {NodeVM}			= require('vm2');
const Highland			= require('highland');
const fs				= require('fs');
const spawn				= require('child_process').spawn;
const Type				= require('type-of-is');
const streamToPromise	= require('stream-to-promise');

const Process		= require('./Process');
const command		= require('./command');
const eelscript		= require('./shared/eelscript.parser');

module.exports = {
	getInstance() {
		let vm;
		let sandbox = {
			fs: require('fs'),
			stdout: new Highland(),
			$env: process.env,
			$sys: new Proxy({}, {
				get: (obj, prop) => (obj[prop])? obj[prop]:
					(...args) => obj['exec'](prop, ...args),
				set: (obj, prop, value) => obj[prop] = value
			}),
			$cwd: __dirname,
			//TODO:0 Write tests for this id:9
			requireCommand(path) {
				streamToPromise(
					fs.createReadStream(path)
				).then((file) => {
					vm.run(`
						let self = (function () {
							${file}

							return module.exports;
						})();

						let commfunc = self.toFunction(this.stdout) || self;

						$sys[commfunc.name] = commfunc;
					`,__dirname);
				});
			},
			load(path) {
				streamToPromise(
					fs.createReadStream(path)
				).then((file) => {
					return vm.run(file);
				});
			},
			'_' : Process,
			//FIXME
			map(cb) {
				return new Process(({push, emit, stdin}) => {
					stdin.map(cb).errors((err) => emit('error', err))
						.each(push);
				}).config({
					defaultOutput: sandbox.stdout
				});
			},
			reduce(cb) {
				return new Process(({push, emit, stdin}) => {
					stdin.reduce(cb).errors((err) => emit('error', err))
						.each(push);
				}).config({
					defaultOutput: sandbox.stdout
				});
			},
			filter(cb) {
				return new Process(({push, emit, stdin}) => {
					stdin.filter(cb).errors((err) => emit('error', err))
						.each(push);
				}).config({
					defaultOutput: sandbox.stdout
				});
			}
		};

		sandbox.stdout.receives = 'object/scoped-html';
		vm = new NodeVM({
			timeout: 1000,
			console: 'inherit',
	    	sandbox: sandbox,
			require: {
				external: true,
				builtin: ['fs', 'path', 'os', 'child_process'],
				context: ['highland', 'type-of-is', 'ansi-to-html'],
				mock: {
					command: command
				},
				import: ['fs']
			},
			compiler: eelscript.parse
		});

		sandbox.requireCommand(`${__dirname}/commands/writefile.command.eel`);
		sandbox.requireCommand(`${__dirname}/commands/then.command.eel`);
		sandbox.requireCommand(`${__dirname}/commands/pwd.command.eel`);
		sandbox.requireCommand(`${__dirname}/commands/echo.command.eel`);
		sandbox.requireCommand(`${__dirname}/commands/exec.command.eel`);
		sandbox.requireCommand(`${__dirname}/commands/realpath.command.eel`);
		sandbox.requireCommand(`${__dirname}/commands/cd.command.eel`);

		return vm;
	}
};
