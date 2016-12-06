let _StateMachine = require('pastafarian');

class StateMachine extends _StateMachine {
	constructor(config) {
		super(config);
		let self = this;

		/**
		*	Trigger on the next state change to the
		*	given state
		*	@param {string} evt - The state to trigger to
		*	@param {Function} fn - Callback to trigger
		*	@return {StateMachine}
		*	Taken from: {@link https://github.com/orbitbot/pastafarian}
		*/
		this.once = (evt, fn) => {
			this.on(evt, function onceCb() {
				fn.apply(fn, Array.prototype.slice
					.call(arguments));
				self.unbind(evt, onceCb);
			});

			return this;
		};

		/**
		*	Whenever the object is in state is true
		* 	run the the callback, if the state is already true
		* 	run it right away
		* 	@param {string} evt - The state to trigger to
		* 	@param {Function} fn - Callback to trigger
		* 	@return {StateMachine}
		*/
		this.when = (evt, fn) => {
			//TODO:210 Fix event type checking id:26
			/*if (config.states.keys().indexOf(evt) === -1) {
				throw new Error('State does not exist');
			}*/

			if (this.current === evt) {
				fn();
			}
			else {
				this.once(evt, () => fn());
			}

			return this;
		};

	}
}

module.exports = StateMachine;
