var minimist = require('minimist');
var Command = require('./command.js');

module.exports = () => {
	var self = {};
	var commandList = [];
	var defaultCommand;

	self['find'] = (commandName) => {
		for (command of commandList) {
			if (command.get('names').contains(commandName)) {
				return command;
			}
		}

		return false;
	}

	self['command'] = (command, description) => {
		var newCommand = self['find'](command)

		if (!newCommand) {
			newCommand = new Command(command, description);

			commandList.push(newCommand);
		}

		return newCommand;
	}

	self['catch'] = (command, description) => {
		var newCommand = self['find'](command)

		if (!newCommand) {
			newCommand = new Command(command, description);

			commandList.push(newCommand);
		}

		return newCommand;
	}

	self['exec'] = (commandLine) => {

	}

	self['preprocessor'] = () => {

	}

	self['breakdown'] = (commandline) => {
		var [command, params] = /(.*?) (.*)/.exec(command);

		if (commands.keys().contains(command)) {

		}
		else {

		}
	}

	return self;
}
