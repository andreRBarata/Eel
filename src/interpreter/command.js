const Type					= require('type-of-is');
const Highland				= require('highland');
const stream				= require('stream');

const Process				= require('./Process');
const commandAPI			= require('./shared/commandAPI.parser');
const {chainingObject} 	= require('./shared/common');

/**
*	Create a command that takes in variables and flags
*	@param {string} commandname
*	@param {string} description
*/
module.exports =
	function command(commandname = '', description = '') {
		let Command = chainingObject({
			arguments:
				['arguments', (args = '') => {
					let parsed = commandAPI
						.args
						.parse(args);

					if (parsed.status === false) {
						return new Error('Invalid arguments provided');
					}

					return parsed.value;
				}, {default: []}],
			description: ['description',
				{default: description}
			],
			receives: ['receives'],
			version: ['version'],
			help: ['help'],
			validation:
				['validation', () => {
					// function
				}],
			option:
				['options',
					(flags, description, option) => {

					}, {map: true}
				],
			display:
				['display',
					(mimetype = '', template = '') => [mimetype, template], {map: true, default: new Map([
						['object/scoped-html', (data) => {
							return {
								scope: data,
								html: Command.display('text/html')(data)
							}
						}],
						['text/html', (data) => '{{src}}'],
						['text/x-ansi', (data) => JSON.stringify(data)]//TODO: Add ansi encoding id:13
					])}
				],
			action: ['action'],
			//TODO: Complete parameter parsing id:14
			parseArgs(rawargs) {
				let counts = this.arguments();
				let args = [];

				for (let arg of rawargs) {
					if (Type.is(arg, String) && false) {//TODO: Replace this

					}
					else {
						args.push(arg);
					}
				}

				return {
					_: args
				}
			},
			toFunction(sysout) {
				let obj = {
					[commandname]: (...args) => {
						let expectedArgs = this.arguments();
						let parsedArgs = this.parseArgs(args);

						return new Process(({push, emit, stdin, stdout}) =>
							this.action()(Object.assign({
									$stdin: stdin,
									$stdout: stdout,
									$arguments: args
								}, parsedArgs),
								push
							), {
								defaultOutput: sysout,
								preprocessor: (destination) => {
									let receives = destination.receives;
									let fn = this.display(receives);

									if (fn) {
										return stream.Transform({
											objectMode: true,
											transform(chunk, encoding, cb) {
												cb(null, fn(chunk));
											}
										});
									}
								},
								receives: this.receives(),
							});
					}
				};

				return obj[commandname];
			}
		});

		return Command;
	};
