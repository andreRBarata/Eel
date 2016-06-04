var parser;

module.exports = parser = {
	'argMatcher': /(?:\[|<).*(?:\]|>)/g,
	'matchCommand': (command) => {

	},
	'getArgsLiteral': (argsline) => {
		if (!argsline || typeof argsline !== 'string') {
			return new Error('Invalid Parameter');
		}

		return argsline.split(new RegExp(parser.argMatcher, 'g'))
			.map((line) => line.trim());
	},
	'parseExpectedArgs': (argsline) => {
		if (!argsline || typeof argsline !== 'string') {
			return new Error('Invalid Parameter');
		}
		var variables = {};

		argsline
			.match(parser.argMatcher)
			.forEach((variable) => {
				//TODO:70 Is this being overwritten?
				var varoptions = {};
				var matches;
				var name;

				if ((matches = variable.match(/<(.*)>/))) {
					varoptions.required = true;
				}
				else if ((matches = variable.match(/\[(.*)\]/))) {
					varoptions.required = false;
				}

				if (matches !== null) {
					name = matches[1];

					if ((matches = name.matches(/(.*)\.\.\./))) {
						varoptions.multiple = true;
					}
					name = matches[1] || name;
				}

				if (variables[name]) {
					return new Error('Repeating variable');
				}

				variables[name] = varoptions;
			});

		return variables;
	}
};
