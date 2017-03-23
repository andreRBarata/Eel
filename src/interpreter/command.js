const Type			= require('type-of-is');
const Highland		= require('highland');
const stream		= require('stream');
const P				= require('parsimmon');


const Process			= require('./Process');
const commandAPI		= require('./shared/commandAPI.parser');
const {chainingObject}	= require('./shared/common');

/**
*	Creates a command that takes in variables and flags
*	@param {string} header - the command name followed
*	by the expected arguments
*	@param {string} description
*
*	@author André Barata
*/
module.exports =
	function (header = '', description = '') {
		let parsedHeader = commandAPI
			.header
			.parse(header);

		if (parsedHeader.status === false) {
			throw new Error('Invalid header provided');
		}

		let [commandname, argsTemplate] =
			parsedHeader.value;


		let command = Object.assign(
			function (...commandArgs) {
				let expectedArgs = command.usage();

				let options = {
					preprocessor(destination) {
						let mimetype;
						let fn;

						if (destination.pipe) {
							mimetype = destination.receives || '';
						}
						else {
							mimetype = destination;
						}

						fn = command.display(mimetype);

						if (fn) {
							return stream.Transform({
								objectMode: true,
								transform(chunk, encoding, cb) {
									cb(null, fn(chunk));
								}
							});
						}

					},
					receives: command.receives()
				};

				return new Process(({push, emit, stdin, stdout}) => {
					let parsedArgs;

					try {
						parsedArgs = command.parseArgs(commandArgs);
					}
					catch (err) {
						emit('error', err);
					}

					if (parsedArgs.help) {
						push('command.usage()');
					}
					else {
						command.action()(Object.assign({
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
						);
					}
				}, options);
			},
			chainingObject({
				description: ['description',
					{default: description}
				],
				receives: ['receives'],
				version: ['version'],
				// help: ['help'],
				usage:
					['usage', (usage) => {
						let parsedUsage = commandAPI
							.headerArgs
							.parse(usage);


						if (parsedUsage.status === false) {
							throw new Error('Invalid usage provided');
						}

						return parsedUsage.value;

					}, {default: argsTemplate}],
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
						}, {multiple: true, default: [
								commandAPI
									.options
									.flaglist
									.parse('-h, --help').value
							]
						}
					],
				display:
					['display',
						(mimetype = '', template = '') => [mimetype, template], {map: true, default: new Map([
							['object/scoped-html', (data) => {
								return {
									scope: data,
									html: command.display('text/html')(data)
								};
							}],
							['text/html', (data) => '{{src}}'],
							['text/x-ansi', (data) => JSON.stringify(data)]//TODO: Add ansi encoding id:13
						])}
					],
				action: ['action'],
				parseArgs(rawargs = []) {
					let args = [];
					let flags = {};
					let possibleFlags = P.alt(...(command.option()
						.map((option) => option.parser))
					);

					for (let index in rawargs) {
						let arg = rawargs[index];
						let next = (rawargs.length > index)?
							rawargs[index + 1]:
							null;


						if (Type.is(arg, String) && possibleFlags) {//#Done: Test flag variables id:20
							let parsedArg = possibleFlags
								.parse(arg);

							if (parsedArg.status) {
								let parsed = parsedArg.value;

								if (parsed.next) {
									if (next) {
										flags[parsed.name] = next;
										index++;
									}
									else {
										throw new Error('Not enough arguments');
									}
								}
								else {
									flags[parsed.name] = parsed.value;
								}

								continue;
							}
						}

						args.push(arg);
					}

					if (command.usage()) {
						if (command.usage().min > args.length) {
							throw new Error('Not enough arguments');
						}

						if (command.usage().max !== '*' && command.usage().max < args.length) {
							throw new Error('Too many arguments');
						}
					}

					return Object.assign(flags, {
						_: args
					});
				}
			})
		);

		return command;
	};
