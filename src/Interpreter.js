const vm = require('vm');

class Interpreter {
	constructor() {
		let context = require('./context')
			.getInstance();

		this.status = context.status;
		this.stdout = context.stdout;
		this.context = vm.createContext(
			context.system
		);
	}

	//TODO: Rewrite stdout connections id:11
	/**
	*	Runs Code in the current instance
	*	@param {string} code - Code to be executed
	*/
	runCode(code) {
		if (!this.context) {
			return new Error('System not loaded');
		}

		return vm.runInContext(code, this
			.context
		);
	}
}

module.exports = Interpreter;
