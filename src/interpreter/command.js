const minimist			= require('minimist');

const Process			= require('./Process');
const parsers			= require('./shared/parsers');
const {chainFunction} 	= require('./shared/common');

/**
*	Create a command that takes in variables and flags
*	@param {string} commandname
*	@param {string} description
*/
module.exports =
	function command(commandname = '', description = '') {
		let Command = {
			arguments:
				chainFunction('arguments', (args = '') => {
					let parsed = parsers
						.command
						.args
						.parse(args);

					if (parsed.status === false) {
						return new Error('Invalid arguments provided');
					}

					return parsed.value;
				}, {default: []}),
			description: chainFunction('description',
				{default: description}
			),
			receives: chainFunction('receives',
				{multiple: true}
			),
			version: chainFunction('version'),
			help: chainFunction('help'),
			validation:
				chainFunction('validation', () => {
					// function
				}),
			option:
				chainFunction('options',
					(flags, description, option) => {

					}, {map: true}
				),
			display:
				chainFunction('display',
					(mimetype = [], template = '') => [mimetype, template], {map: true}
				),
			action: chainFunction('action'),
			toFunction($env) {
				let obj = {
					[commandname]: (...args) => {
						let parsedArgs = minimist(args);
						let expectedArgs = Command.arguments();
						//FIXME
						for (let expectedArg of expectedArgs) {
							if (expectedArg.multiple) {
								parsedArgs[expectedArg.name] =
									parsedArgs._.splice(0,
										parsedArgs._.length - (expectedArgs.length - index)
									);
							}
							else {
								parsedArgs[expectedArg.name] =
									parsedArgs._.splice(0, 1)[0];
							}
						}

						parsedArgs._ = args;

						return new Process((push, emit, input) =>
							Command.action()(push, parsedArgs, input));
					}
				}

				return obj[commandname];
			}
		};

		return Command;
	};
