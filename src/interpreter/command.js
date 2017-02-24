const Type			= require('type-of-is');
const Highland		= require('highland');
const stream		= require('stream');
const AnsiToHtml	= require('ansi-to-html');
const P				= require('parsimmon');


const Process			= require('./Process');
const commandAPI		= require('./shared/commandAPI.parser');
const {chainingObject}	= require('./shared/common');

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
						throw new Error('Invalid arguments provided');
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
				['option',
					(flags, description) => {
						let parsedFlags = commandAPI
							.options
							.flaglist
							.parse(flags);

						if (parsedFlags.status === false) {
							throw new Error('Invalid flags provided');
						}

						return Object.assign(parsedFlags.value,
							{description: description}
						);
					}, {multiple: true}
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
			parseArgs(rawargs = []) {
				let counts = this.arguments();
				let args = [];
				let flags = {};
				let possibleFlags = false;

				if (this.option().length) {
					possibleFlags = P.alt(...(this.option()
						.map((option) => option.parser))
					);
				}

				for (let arg of rawargs) {
					if (Type.is(arg, String) && possibleFlags) {//TODO: Add flag variables
						let parsedArg = possibleFlags.parse(arg);
						if (parsedArg.status) {
							flags[parsedArg.value.name] = parsedArg.value.value;
						}
						else {
							args.push(arg);
						}
					}
					else {
						args.push(arg);
					}
				}

				if (counts.min > args.length) {
					throw new Error('Not enough arguments');
				}

				if (counts.max !== '*' && counts.max < args.length) {
					throw new Error('Too many arguments');
				}

				return Object.assign(flags, {
					_: args
				});
			},
			toFunction(sysout) {
				return (...commandargs) => {
					let expectedArgs = this.arguments();

					let options = {
						defaultOutput: sysout,
						preprocessor: (destination) => {
							let receives = destination.receives || '';
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
					};
					let parsedArgs;

					try {
						parsedArgs = this.parseArgs(commandargs);
					}
					catch (err) {
						return new Process(({emit, push}) => {
							emit('error', parsedArgs);
							push(null);
						});
					}

					return new Process(({push, emit, stdin, stdout}) =>
						this.action()(Object.assign({
								$stdin: stdin,
								$stdout: stdout,
							}, parsedArgs),
							(data) => {
								if (Type.is(data, Error)) {
									emit('error', data);
								}
								else {
									push(data);
								}
							}
						), options);
				}
			}
		});

		return Command;
	};
