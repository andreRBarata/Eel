const EventEmitter = require('events').EventEmitter;

class StateMachine extends EventEmitter {
	constructor(config) {
		super();

		this.currentState = config.initial;
		this.states = config.states;
	}

	/**
	*	Alter Current state
	*	@param {string} state - State to change to
	*/
	go(state) {
		let possibleStates =
			this.states[this.currentState] || [];


		if (!possibleStates.includes(state)) {
			throw new Error('Invalid state change');
		}

		this.emit(state);
		this.currentState = state;
	}

	/**
	*	Whenever the object is in state is true
	* 	run the the callback, if the state is already true
	* 	run it right away
	* 	@param {string} evt - The state to trigger to
	* 	@param {Function} fn - Callback to trigger
	* 	@return {StateMachine}
	*/
	when(evt, fn) {
		//#Done:110 Fix event type checking id:26
		let possibleStates =
			this.states[this.currentState] || [];

		if (this.currentState !== evt &&
			!possibleStates.includes(evt)) {
				throw new Error('Invalid state change');
		}

		if (this.currentState === evt) {
			fn();
		}
		else {
			this.once(evt, () => fn());
		}

		return this;
	}
}

module.exports = StateMachine;
