var parser = require('parser.js');

//Add option for parameter decontructor
module.exports = function Command(command, description) {
	var self = Command.prototype;
	var commandData = {};

	//TODO: Consider storage method for aliases
	self.alias = (alias) => {
		if (!alias) {
			return;
		}

		if (!commandData.command) {
			commandData.command = [];
		}

		if (!commandData.args) {
			commandData.args = {};
		}

		var args = parser.parseExpectedArgs(alias);

		commandData.command.push(parser.generateMatcherString(command));

		for (var key of args.keys()) {
			commandData.args[key] = args[key];
		}

		return this;
	};

	//TODO: Consider storage method for flags
	self.option = () => {
		var option, description, autocomplete;

<<<<<<< Updated upstream
<<<<<<< HEAD
	self.flag = () => {
=======
	self.alias = (alias) => {
		parseExpectedArgs(command);

		return this;
	}

	self.validate = (validation) => {
		commandData['validation'] = validation;

		return this;
	}

	//TODO: Finish this function
	self.option = () => {
>>>>>>> 61ef9ec057a144d8d3b444f4ca1cd4ef7a6d2b5a
		var [option, description, autocomplete] = arguments;
=======
		if (arguments.length <= 2) {
			option = arguments[0];
			autocomplete = arguments[1];
		}
		else {
			[option, description, autocomplete] = arguments;
		}
>>>>>>> Stashed changes

		if(typeof description === 'array') {
			autocomplete = description;
			description = null;
		}

		return this;
	};

	//TODO: Finish exec function
	self.exec = (args) => {

	};

	{
		commandData = {
			'alias': [],
			'description': '',
			'help': '',
			'validation': null,//function
			'option': {},
			'action': null//function
		};

		for (var field of commandData.keys()) {
			if (!self[field]) {
				self[field] = (arg) => {
					if (!args) {
						return commandData[field];
					}
					else {
						commandData[field] = description;
						return this;
					}
				};
			}
		}

		self.alias(command);
	}
};
