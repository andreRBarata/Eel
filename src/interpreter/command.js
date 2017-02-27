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
			function command(...commandArgs) {
				let expectedArgs = argsTemplate;

				let options = {
					preprocessor: (destination) => {
						let receives = destination.receives || '';
						let fn = command.display(receives);

						if (fn) {
							return stream.Transform({
								objectMode: true,
								transform(chunk, encoding, cb) {
									cb(null, fn(chunk));
								}
							});
						}
					},
					receives: command.receives(),
				};

				return new Process(({push, emit, stdin, stdout}) => {
					let parsedArgs;

					try {
						parsedArgs = command.parseArgs(commandArgs);
					}
					catch (err) {
						emit('error', err);
					}

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
				}, options);
			},
			chainingObject({
				args: argsTemplate,
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
									html: command.display('text/html')(data)
								};
							}],
							['text/html', (data) => '{{src}}'],
							['text/x-ansi', (data) => JSON.stringify(data)]//TODO: Add ansi encoding id:13
						])}
					],
				action: ['action'],
				//#Done: Complete parameter parsing id:14
				parseArgs(rawargs = []) {
					let args = [];
					let flags = {};
					let possibleFlags = false;

					if (command.option().length) {
						possibleFlags = P.alt(...(command.option()
							.map((option) => option.parser))
						);
					}

					for (let arg of rawargs) {
						if (Type.is(arg, String) && possibleFlags) {//TODO: Complete flag variables id:20
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

					if (argsTemplate) {
						if (argsTemplate.min > args.length) {
							throw new Error('Not enough arguments');
						}

						if (argsTemplate.max !== '*' && argsTemplate.max < args.length) {
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
