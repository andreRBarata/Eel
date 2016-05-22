//#InProgress:0 Finish Commander Module
function interpreter() {
	var Command = require('./command');

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
		newCommand = self['command'](command, description);
		defaultCommand = newCommand;

		return newCommand;
	}

	self['exec'] = (commandLine, callback) => {
		var [, command, options] = /(\w+)(?: (.*))?/
			.exec(commandLine) || [];
		var args, optionsParsed;

		if (options) {
			optionsParsed = minimist(options);
		}

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

	return self;
}

module.exports = interpreter();
