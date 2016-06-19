angular.module('termApp')
	.factory('interpreter', function(Command) {
		var homedir = require('homedir');
		var repl = require('repl');
		var environment = {
			'cwd': homedir(),
			'env': {}
		};

		var interpreter;
		var shell;

		shell = repl.start({
			prompt: '>',
			eval: () => callback(null,cmd),
			writer: (output) => output.toUpperCase()
		});

		interpreter = {
			'commands': [],
			'defaultCommand': null,
			//TODO:20 Fix find function
			'find': (commandName) => {
				/*for (var command of interpreter.commands_) {
					if (command.get('names').contains(commandName)) {
						return command;
					}
				}*/

				return false;
			},
			'use': (module) => {
				require(module)(interpreter);
			},
			'command': (command, description) => {
				var newCommand = interpreter.find(command);

				if (!newCommand) {
					newCommand = new Command(command, description);

					interpreter.commands.push(newCommand);
				}

				return newCommand;
			},
			'catch': (command, description) => {
				var newCommand = interpreter.command(command, description);

				interpreter.defaultCommand = newCommand;

				return newCommand;
			},
			//TODO: Add REPL
			'exec': (commandLine, callback) => {




				shell.input.write(`${commandLine}\n`);
				//shell.input.on('data', callback);

				/*var command = interpreter.find(commandLine);

				if (!command) {
					command = interpreter.defaultCommand;
				}

				command.exec(commandLine, environment, callback);*/

			}
		};

		return interpreter;
	});
