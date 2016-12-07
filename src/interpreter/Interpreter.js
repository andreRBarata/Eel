const vm			= require('vm');
const sweet			= require('sweet.js');
const StateMachine	= require('./shared/StateMachine');

class Interpreter extends StateMachine {
	constructor() {
		super({
			initial: 'unloaded',
			states: {
				unloaded: ['loaded']
			}
		});

		this.context = vm.createContext(
			require('./context')
				.getInstance()
		);

		this.context.when('loaded', () => {
			this.go('loaded');
		});
		this.stdout = this.context.stdout;


		sweet.loadMacro('./src/interpreter/sweetScripts/operators.sjs');
	}

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
