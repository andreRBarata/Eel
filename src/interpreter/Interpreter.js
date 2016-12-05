const vm		= require('vm');
const sweet	= require('sweet.js');

class Interpreter {
	constructor() {
		let context = require('./context')
			.getInstance();

		this.status = context.status;
		this.stdout = context.stdout;
		this.context = vm.createContext(
			context.system
		);

		sweet.loadMacro('./src/interpreter/sweetScripts/operators.sjs');
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
		console.log(sweet.compile(code).code);
		return vm.runInContext(
			sweet.compile(code).code,
			this.context
		);
	}
}

module.exports = Interpreter;
