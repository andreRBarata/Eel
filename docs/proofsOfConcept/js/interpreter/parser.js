
let parser = {
	argMatcher: /\[.*\]|<.*?>/g,
	//TODO:180 Finish command matching method
	interpretArguments(command, argsline) {
		let commandLiterals = command.format();

		for (let letter of argsline.split('')) {

		}
	},
	commandNameOf(formatstring) {
		return formatstring.split(' ')[0];
	},
	commandComponents(formatstring) {
		if (!formatstring || formatstring instanceof String) {
			throw new TypeError('Must have a string parameter');
		}

		return formatstring.split(parser.argMatcher);
	},
	parseExpectedArgs(formatstring) {
		if (!formatstring || formatstring instanceof String) {
			throw new TypeError('Must have a string parameter');
		}
		let letiables = {};

		formatstring
			.match(parser.argMatcher)
			.forEach((letiable) => {
				let letoptions = {};
				let matches;
				let name;

				if ((matches = letiable.match(/<(.*)>/))) {
					letoptions.required = true;
				}
				else if ((matches = letiable.match(/\[(.*)\]/))) {
					letoptions.required = false;
				}

				if (matches !== null) {
					name = matches[1];

					if ((matches = name.match(/(.*)\.\.\./))) {
						letoptions.multiple = true;
					}
					name = (matches)? matches[1]: name;
				}

				if (letiables[name]) {
					throw new Error('Repeating letiable');
				}

				letiables[name] = letoptions;
			});

		return letiables;
	}
};

module.exports = parser;
