const Type = require('type-of-is');

//TODO:Test common module
const common = {
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
	*	Creates an object of chain with functions
	*	@param {Object} object - Object with the structure to use
	*/
	chainingObject(object) {
		let output = {};

		for (let field in object) {
			if (Type.is(object[field], Array)) {
				let [name, fn, options = {}] = object[field];
				let index = `_${name}`;

				if (Type.is(fn, Object)) {
					options = fn;
					fn = null;
				}

				if (!options.default) {
					if (options.multiple) {
						options.default = [];
					}
					else if (options.map) {
						options.default = new Map();
					}
				}

				output[index] = options.default;
				output[field] = common.chainFunction([name, fn, options])
			}
			else {
				output[field] = object[field];
			}
		}

		return output;
	},
	/**
	*	Creates a function that can be used for chaining
	*	to get and set variables
	*	@param {string} name - name of the location to store data in
	*	@param [function] fn - function to process the arguments
	*	@param [{multiple: boolean, map: boolean, default: any}] options
	*	@returns {function}
	*/
	chainFunction([name, fn, options = {}]) {
		let index = `_${name}`;

		return function (...innerargs) {
			if (!innerargs.length) {
				return this[index];
			}

			if (innerargs.length === 1 && options.map) {
				let element = innerargs[0];
				//TODO: Add order priorities id:21
				for (let [key, value] of this[index]) {
					if (Type.is(key, RegExp) &&
						Type.is(element, String) &&
						key.test(element)) {
							return value;
					}
					else if (key === element) {
						return value;
					}
				}

				return null;
			}

			let output = (!fn)?
				innerargs: fn(...innerargs);

			if (output.length === 1) {
				output = output[0];
			}

			if (Type.is(output, Error)) {
				return output;
			}

			if (options.multiple) {
				this[index]
					.push(output);
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

module.exports = common;
