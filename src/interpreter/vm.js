const {NodeVM}				= require('vm2');
const Highland				= require('highland');
const fs						= require('fs');
const spawn					= require('child_process').spawn;
const Type					= require('type-of-is');
const streamToPromise	= require('stream-to-promise');

const Process		= require('./Process');
const command		= require('./command');
const eelscript	= require('./shared/eelscript.parser');

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
			load(path) {
				return vm.run(
					`${fs.readFileSync(path)}`,
					path
				);
			},
			'_' : Process
		};

		sandbox.stdout.receives = 'object/scoped-html';
		vm = new NodeVM({
			timeout: 1000,
	    	sandbox: sandbox,
			require: {
				external: true,
				builtin: ['fs', 'path', 'os', 'child_process'],
				context: ['highland', 'type-of-is', 'ansi-to-html'],
				mock: {
					command: command
				}
			},
			compiler: eelscript.parse
		});

		sandbox.load(`${__dirname}/startup.eel`);

		return vm;
	}
};
