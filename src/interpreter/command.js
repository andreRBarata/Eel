const Process			= require('./Process');

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
					// '',
				}),
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
			toFunction() {
				let obj = {
					[commandname]: (...args) => {
						return new Process(Command.action(...args));
					}
				}

				return obj[commandname];
			}
		};

		return Command;
	};
