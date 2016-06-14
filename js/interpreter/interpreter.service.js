termApp.factory('interpreter', function(Command, homedir) {
	var environment = {
		'cwd': homedir(),
		'env': {}
	};

	var interpreter = {
		'_commands_': [],
		'defaultCommand': null,
		//TODO:20 Fix find function
		'find': (commandName) => {
			/*for (var command of interpreter._commands_) {
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

				interpreter._commands_.push(newCommand);
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
			var command = interpreter.find(commandLine);

			if (!command) {
				command = interpreter.defaultCommand;
			}

			command.exec(commandLine, environment, callback);

		}
	};

	return interpreter;
});
