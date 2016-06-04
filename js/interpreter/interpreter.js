//#InProgress:0 Finish Interpreter Module
var Command = require('./command');

{
	'use strict';

<<<<<<< Updated upstream
	//FIXME: Finder function broken with update
	self['find'] = (commandName) => {
		for (command of commandList) {
=======

module.exports = {
	'_commands_': [],
	'_defaultCommand_': null,
	//TODO:50 Fix find function
	'find': (commandName) => {
		for (var command of this._commands_) {
>>>>>>> Stashed changes
			if (command.get('names').contains(commandName)) {
				return command;
			}
		}

		return false;
	},
	'command': (command, description) => {
		var newCommand = this.find(command);

		if (!newCommand) {
			newCommand = new Command(command, description);

			commandList.push(newCommand);
		}

		return newCommand;
	},
	'catch': (command, description) => {
		var newCommand = this.command(command, description);
		var defaultCommand = newCommand;

		return newCommand;
	},
	//TODO:40 Fix exec function
	'exec': (commandLine, callback) => {
		var [, command, options] = /(\w+)(?: (.*))?/
			.exec(commandLine) || [];
		var args, optionsParsed;

		args = {
			'command': command,
			'options': args
		};

		if (find(command)) {

		}
		else {
			defaultCommand
				.get('action')(args, callback);
		}
	}
};
}
