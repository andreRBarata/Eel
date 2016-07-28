angular.module('termApp')
	.factory('parser', function() {
		var parser = {
			argMatcher: /\[.*\]|<.*?>/g,
			//TODO:0 Finish command matching method
			interpretArguments(command, argsline) {
				var commandLiterals = command.format();

				for (var letter of argsline.split('')) {

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
				var variables = {};

				formatstring
					.match(parser.argMatcher)
					.forEach((variable) => {
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

							if ((matches = name.match(/(.*)\.\.\./))) {
								varoptions.multiple = true;
							}
							name = (matches)? matches[1]: name;
						}

						if (variables[name]) {
							throw new Error('Repeating variable');
						}

						variables[name] = varoptions;
					});

				return variables;
			}
		};

		return parser;
	});
