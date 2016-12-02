const vm		= require('vm');
const sweetJS	= require('sweet.js');

class Interpreter {
	constructor() {
		let context = require('./context')
			.getInstance();

		this.status = context.status;
		this.stdout = context.stdout;
		this.context = vm.createContext(
			context.system
		);

		/*sweetJS.loadModule(`
			macro define {
				rule { $items:item (,) ... ; } => {
			    	$items (;) ...
				}
			}
		`);*/
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

		return vm.runInContext(
			 sweetJS.compile(code),
			 this.context
		);
	}
}

module.exports = Interpreter;
