module.exports = function Command(command, description) {
	var self = Command.prototype;
	var commandData = {};

	function optionFor(arg) {
		for (var i = 0, len = this.options.length; i < len; ++i) {
			if (commandData.options[i].is(arg)) {
				return this.options[i];
			}
		}
	}

	function normalize(args) {
		var ret = []
			, arg
			, lastOpt
			, index;

		for (var i = 0, len = args.length; i < len; ++i) {
			arg = args[i];
			if (i > 0) {
				lastOpt = this.optionFor(args[i-1]);
			}

			if (arg === '--') {
				// Honor option terminator
				ret = ret.concat(args.slice(i));
				break;
			} else if (lastOpt && lastOpt.required) {
				ret.push(arg);
			} else if (arg.length > 1 && '-' == arg[0] && '-' != arg[1]) {
				arg.slice(1).split('').forEach(function(c) {
					ret.push('-' + c);
				});
			} else if (/^--/.test(arg) && ~(index = arg.indexOf('='))) {
				ret.push(arg.slice(0, index), arg.slice(index + 1));
			} else {
				ret.push(arg);
			}
		}

		return ret;
	}

	function parseExpectedArgs(args) {
		if (!args.length) return;

		if (!commandData['argDetails']) {
			commandData['argDetails'] = [];
		}

		for (arg of args) {
			var argDetails = {
				required: false,
				name: '',
				variadic: false
			};

			switch (arg[0]) {
				case '<':
					argDetails.required = true;
					argDetails.name = arg.slice(1, -1);
					break;
				case '[':
					argDetails.name = arg.slice(1, -1);
					break;
			}

			if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
				argDetails.variadic = true;
				argDetails.name = argDetails.name.slice(0, -3);
			}
			if (argDetails.name) {
				commandData['argDetails']
					.push(argDetails);
			}
		}
	}

	self.description = (description) => {
		commandData['description'] = description;

		return this;
	}

	self.help = (help) => {
		commandData['help'] = help;

		return this;
	}

	self.alias = (alias) => {
		parseExpectedArgs(command);

		return this;
	}

	self.validate = (validation) => {
		commandData['validation'] = validation;

		return this;
	}

	self.option = () => {
		var [option, description, autocomplete] = arguments;

		if(typeof description === 'array') {
			autocomplete = description;
			description = null;
		}

		if(!this.commandData['options']) {
			commandData['options'] = [];
		}

		return this;
	}

	self.action = (action) => {
		commandData['action'] = action;

		return this;
	}

	//TODO: Finish parameter parsing
	{
		parseExpectedArgs(command);
		console.log(this);
	}
}
