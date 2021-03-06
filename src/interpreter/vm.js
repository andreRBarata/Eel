/**
 * @summary Creates and return a VM instance
 *
 * @author André Barata
 */

const {NodeVM}			= require('vm2');
const Highland			= require('highland');
const fs				= require('fs');
const childProcess		= require('child_process');
const Type				= require('type-of-is');

const Process	= require('./Process');
const command	= require('./command');
const eelscript	= require('./shared/eelscript.parser');

module.exports = {
	getInstance() {
		let vm;
		let cwd = process.cwd();
		let sandbox = {
			process: {
				stdout: new Highland(),
				title: 'Eelscript',
				version: process.version,
				env: Object.assign(process.env, {TERM: 'xterm-color'}),
				sys: new Proxy({}, {
					get: (obj, prop) => (obj[prop])? obj[prop]:
						(...args) => obj['exec'](prop, ...args),
					set: (obj, prop, value) => obj[prop] = value
				}),
				cwd() {
					return cwd;
				},
				chdir(_cwd) {
					cwd = _cwd;
					this.emit('cwdchange', cwd);
				},
				on(event, handler) {
					return this.stdout.on(event, handler);
				},
				emit(event, data) {
					return this.stdout.emit(event, data);
				},
				sys: new Proxy({}, {
					get: (obj, prop) => (obj[prop])? obj[prop]:
						(...args) => obj['exec'](prop, ...args),
					set: (obj, prop, value) => obj[prop] = value
				})
			},
			load(path) {
				return vm.run(
					`${fs.readFileSync(path)}`,
					path
				);
			},
			'_' : Process
		};

		vm = new NodeVM({
			timeout: 1000,
	    	sandbox: sandbox,
			console: 'inherit',
			require: {
				external: true,
				context: 'sandbox',
				builtin: ['fs', 'path', 'os', 'child_process',
					'util', 'events', 'string_decoder', 'stream'],
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
