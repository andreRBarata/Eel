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
		require('./ContextFactory')
			.getInstance().then((context) => {
				this.context = vm.createContext(
					context
				);

				this.stdout = this.context.stdout;

				this.go('loaded');
			}
		);

		sweet.currentReadtable().extend({
			':': function(ch, reader) {
				var token = reader.readToken();
				console.log('test', token);
				return null;
				// Continue parsing and return a single token or
				// an array of tokens
			}}
		);

		sweet.loadMacro(
			'./src/interpreter/shared/syntax.sjs'
		);
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
