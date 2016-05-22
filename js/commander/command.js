module.exports = function Command(command, description) {
	var self = Command.prototype;
	var commandData = {};

	//TODO: Finish parameter parsing
	{
		this.teste = "teste";
	}

	self.description = (description) => {
		commandData['description'] = description;

		return this;
	}

	self.help = (help) => {
		commandData['help'] = help;

		return this;
	}

	self.alias = (alias) => {
		if (!commandData['names']) {
			commandData['names'] = [];
		}

		commandData['names'].concat(
			(typeof alias !== 'array')?
				[alias]: alias
		);

		return this;
	}

	self.validate = (validation) => {
		commandData['validation'] = validation;

		return this;
	}

	self.option = () => {
		var [option, description, autocomplete] = arguments;

		if(typeof description === 'array') {
			autocomplete = description;
			description = null;
		}

		if(!this.commandData['options']) {
			commandData['options'] = [];
		}

		return this;
	}

	self.action = (action) => {
		commandData['action'] = action;

		return this;
	}

	self.get = (property) => {
		console.log(commandData);
		return commandData[property];
	}
}
