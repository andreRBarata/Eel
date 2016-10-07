const vm		= require('vm');
const Highland	= require('highland');

const system	= require('./system');


class Interpreter {
	constructor() {
		this.stdout = new Highland();

		this.context = vm.createContext(system({
			'$env': process.env,
			'echo': (text) => this.stdout.write(text) //TODO: Replace temporary echo function
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
