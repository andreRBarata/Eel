const matcher = /((?:\s*\[|<).*?(?:\]\s*|>))/g;

module.exports = {
	'generateMatcherString': (argsline) => {
		if (!argsline || typeof argsline !== 'string') {
			return new Error('Invalid Parameter')
		}

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
			return new Error('Invalid Parameter')
		}
		var variables = {};

		for (variable of argsline.match(matcher)) {
			var varoptions = {};
			var name;

			if (matches = variable.match(/\s*<(.*)>\s*/)) {
				varoptions['required'] = true;
			}
			else if (matches = variable.match(/\s*\[(.*)\]\s*/)) {
				varoptions['required'] = false;
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
	}
}
