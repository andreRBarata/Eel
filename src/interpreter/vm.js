const {VM}			= require('vm2');
const Highland		= require('highland');
const fs			= require('fs');
const spawn			= require('child_process').spawn;
const Type = require('type-of-is');

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
	system: {},
	getInstance() {
		let sandbox = {
			$env: process.env,
			stdout: new Highland(),
			system: new Proxy(this.system, {
				get: (obj, prop) => (obj[prop])? obj[prop]:
					generateSystemFunction(prop, {
						defaultOutput: sandbox.stdout
					})
			}),
			'_' : Process,
			writeFile(file) {
				return fs.WriteStream(file);
			},
			//FIXME
			map(cb) {
				return (new Highland()).map(cb);
			},
			reduce(cb) {
				return (new Highland()).reduce(cb);
			},
			filter(cb) {
				return (new Highland()).filter(cb);
			}
		};

		return new VM({
			timeout: 1000,
			console: 'off',
	    	sandbox: sandbox,
			require: {
				import: ['./commands/cd.command']
			},
			compiler: parsers.vm.parse
		});

	}
};
