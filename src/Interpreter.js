const vm		= require('vm');
const Highland	= require('highland');

const Process	= require('./Process');
const system	= require('./system');


class Interpreter {
	constructor() {
		this.stdout = new Highland();

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

		if (output instanceof Process) {
			output.stdout.pipe(this.stdout, {end: false});
			
			return;
		}
		else {
			this.stdout.write(output);

			return output;
		}
	}
}

module.exports = Interpreter;
