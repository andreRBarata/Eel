const vm			= require('vm');
const EventEmitter	= require('events').EventEmitter;
const Highland		= require('highland');

const Process		= require('./Process');
const system		= require('./system');


class Interpreter {
	constructor() {
		this.status = new EventEmitter();
		this.stdout = new Highland();
		
		system({
			$env: process.env
		}).then((system) => {
			this.context = vm.createContext(system);
			this.status.emit('load');
		});
	}

	//TODO: Rewrite stdout connections
	/**
	*	Runs Code in the current instance
	*	@param {string} code - Code to be executed
	*/
	runCode(code) {
		if (!this.context) {
			return new Error('System not loaded');
		}

		return vm.runInContext(code, this.context);
	}
}

module.exports = Interpreter;
