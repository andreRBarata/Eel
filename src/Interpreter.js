const vm = require('vm');

const system = require('./system');


class Interpreter {
	constructor() {
		this.context = vm.createContext(system({
			'$env': process.env
		}));
	}

	/**
	*	Runs Code in the current instance
	*	@param {string} code - Code to be executed
	*/
	runCode(code) {
		let output = vm.runInContext(code, this.context);

		return output;

	}
}

module.exports = Interpreter;
