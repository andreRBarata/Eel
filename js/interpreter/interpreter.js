//#InProgress:0 Finish Interpreter Module
var Command = require('./command');
var interpreter;

module.exports = interpreter = {
	'_commands_': [],
	'defaultCommand': null,
	//TODO:10 Fix find function
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
	//TODO:20 Fix exec function
	'exec': (commandLine, callback) => {

		if (interpreter.find(commandLine)) {

		}
		else {
			interpreter.defaultCommand
				.exec(commandLine, callback);
		}
	}
};
