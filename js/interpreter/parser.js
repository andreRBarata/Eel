module.exports = {
	'matcher': /((?:\s*\[|<).*?(?:\]\s*|>))/g,
	'generateMatcherString': (argsline) => {
		if (!argsline || typeof argsline !== 'string') {
			return new Error('Invalid Parameter');
		}

		//TODO:60 Fix returned regex for quoted strings
		return argsline.replace(matcher, function (match, contents, offset, s) {
			if (match.match(/\s*<.*>\s*/)) {
				return '(.+)';
			}
			else if (match.match(/\s*\[.*\]\s*/)) {
				return '(.*)';
			}
			else {
				return match;
			}
		});
	},
	'parseExpectedArgs': (argsline) => {
		if (!argsline || typeof argsline !== 'string') {
			return new Error('Invalid Parameter');
		}
		var variables = {};

		for (var variable of argsline.match(this.matcher)) {
			//TODO:70 Is this being overwritten?
			var varoptions = {};
			var name;

			if ((matches = variable.match(/\s*<(.*)>\s*/))) {
				varoptions.required = true;
			}
			else if ((matches = variable.match(/\s*\[(.*)\]\s*/))) {
				varoptions.required = false;
			}

			if (matches !== null) {
				name = matches[1];
			}

			if (variables[name]) {
				return new Error('Repeating variable');
			}

			variables[name] = varoptions;
		}

		return variables;
	},
	//TODO:0 Complete function
	'optionFor': (arg) => {
		for (var i = 0, len = commandData.options.length; i < len; ++i) {
			if (commandData.options[i].is(arg)) {
				return commandData.options[i];
			}
		}
	},
	'normalize': (args) => {
		var ret = [],
			arg,
			lastOpt,
			index;

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
				arg.slice(1).split('').forEach((c) => {
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
};
