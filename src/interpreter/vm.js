const {NodeVM}		= require('vm2');
const Highland		= require('highland');
const fs			= require('fs');
const spawn			= require('child_process').spawn;
const Type			= require('type-of-is');

const Process		= require('./Process');
const command		= require('./command');
const parsers		= require('./shared/parsers');

function generateSystemFunction(commandname, options) {
	return function(...args) {
		let appProcess = new Process((push, emit, input) => {
			//TODO:100 Fix error propagation to backend id:7
			let systemProcess = spawn(commandname,
				(args || []).map(
					(arg) => (!Type.is(arg, String)? JSON.stringify(arg): arg)
				)
			);

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
}

module.exports = {
	getInstance() {
		let sandbox = {
			$env: process.env,
			stdout: new Highland(),
			$sys: new Proxy({}, {
				get: (obj, prop) => (obj[prop])? obj[prop]:
					generateSystemFunction(prop, {
						defaultOutput: sandbox.stdout
					}),
				set: (obj, prop, value) => {console.log(value);return obj[prop] = value; }
			}),
			'_' : Process,
			writeFile(file) {
				return fs.WriteStream(file);
			},
			//FIXME
			map(cb) {
				return new Process((push, emit, input) => {
					input.map(cb).errors((err) => emit('error', err))
						.each(push);
				});
			},
			reduce(cb) {
				return new Process((push, emit, input) => {
					input.reduce(cb).errors((err) => emit('error', err))
						.each(push);
				});
			},
			filter(cb) {
				return new Process((push, emit, input) => {
					input.filter(cb).errors((err) => emit('error', err))
						.each(push);
				});
			}
		};

		let vm = new NodeVM({
			timeout: 1000,
			console: 'off',
	    	sandbox: sandbox,
			require: {
				external: true,
				context: []
			},
			compiler: parsers.vm.parse
		});

		vm.run(`$sys.cd = require('${__dirname}/commands/cd.command').toFunction()`, __dirname + '/commands/cd.command');

		return vm;
	}
};
