angular.module('termApp')
	.factory('interpreter', function(Command) {
		var homedir = require('homedir');
		var environment = {
			'cwd': homedir(),
			'env': {}
		};

		var interpreter = {
			commands: [],
			defaultCommand: null,

			use(module) {
				require(module)(interpreter);
			},
			command(command, description) {
				var newCommand = interpreter.find(command);

				if (!newCommand) {
					newCommand = new Command(command, description);

					interpreter.commands.push(newCommand);
				}

				return newCommand;
			},
			catch(command, description) {
				var newCommand = interpreter.command(command, description);

				interpreter.defaultCommand = newCommand;

				return newCommand;
			},
			//#InProgress:0 Add REPL and use Sweet.js
			//TODO: Move code to new terminal object
			exec(commandLine, callback) {


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
