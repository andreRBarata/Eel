var parser = require('parser.js');

module.exports = function Command(command, description) {
	var self = Command.prototype;
	var commandData = {};

	function optionFor(arg) {
		for (var i = 0, len = commandData.options.length; i < len; ++i) {
			if (commandData.options[i].is(arg)) {
				return commandData.options[i];
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
				lastOpt = optionFor(args[i-1]);
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

	self.alias = (alias) => {
		if (!commandData['command']) {
			commandData['command'] = [];
		}
		if (!commandData['options']) {
			commandData['options'] = {};
		}

		commandData['command'].push(parser.parseExpectedArgs(command));



		return this;
	}

	self.flag = () => {
		var [option, description, autocomplete] = arguments;

		if(typeof description === 'array') {
			autocomplete = description;
			description = null;
		}

		if(!this.commandData['flag']) {
			commandData['flag'] = [];
		}

		return this;
	}

	//TODO: Finish parameter parsing
	{
		var fields = [
			'alias',
			'description',
			'help',
			'validation',
			'flag',
			'action'
		];

		for (field of fields) {
			if (!self[field]) {
				self[field] = (arg) => {
					if (!args) {
						return commandData[field]
					}
					else {
						commandData[field] = description;
						return this;
					}
				}
			}
		}

		self.alias(command);
	}
}
