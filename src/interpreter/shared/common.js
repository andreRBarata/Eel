const Type = require('type-of-is');

module.exports = {
	/**
	*	Creates an objects which is a extended version
	*	of a given prototype with the methods and methods provided
	*	@param {{}} obj
	*	@param {Object} parent
	*/
	bless(obj, parent) {
		let Output = function() {
			for (var index in obj) {
				if (obj.hasOwnProperty(index)) {
					this[index] = obj[index];
				}
			}
		};

		Output.prototype = parent;

		return new Output();
	},
	/**
	*	Creates a function that can be used for chaining
	*	to get and set variables
	*	@param {string} name - name of the location to store data in
	*	@param [function] fn - function to process the arguments
	*	@param [{multiple: boolean, map: boolean, default: any}] options
	*	@returns {function}
	*/
	chainFunction(name, fn = (arg) => arg, options = {}) {
		let index = `_${name}`;
		if (Type.is(fn, Object)) {
			options = fn;
			fn = (arg) => arg;
		}

		if (!options.default) {
			if (options.multiple) {
				options.default = [];
			}
			else if (options.map) {
				options.default = new Map();
			}
		}

		return function (...innerargs) {
			let output = fn(...innerargs);

			if (Type.is(output, Error)) {
				return output;
			}
			if (!this[index]) {
				this[index] = options.default;
			}
			if (!innerargs.length) {
				return this[index];
			}

			if (options.multiple) {
				this[index].push(output);
			}
			else if (options.map) {
				let [key, value] = output;

				this[index].set(key, value);
			}
			else {
				this[index] = output;
			}

			return this;
		}
	}
};
