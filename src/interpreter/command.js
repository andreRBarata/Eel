const minimist			= require('minimist');

const Process			= require('./Process');
const commandAPI		= require('./shared/commandAPI.parser');
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
					let parsed = commandAPI
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
			toFunction(sysout) {
				let obj = {
					[commandname]: (...args) => {
						let expectedArgs = Command.arguments();
						let parsedArgs = {};

						if (expectedArgs) {
							parsedArgs = minimist(args);
						}
						
						return new Process(({push, emit, stdin, stdout}) =>
							Command.action()(Object.assign({
								$stdin: stdin,
								$stdout: stdout,
								$arguments: args
							}, parsedArgs), push), {
									defaultOutput: sysout
							});
					}
				}

				return obj[commandname];
			}
		};

		return Command;
	};
