var minimist = require('minimist');
var Command = require('./command.js');

module.exports = () => {
	var self = {};
	var commandList = [];

	self['command'] = (command, description) => {
		var newCommand = new Command(command, description);

		commandList.push(newCommand);

		return newCommand;
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
