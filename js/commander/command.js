module.exports = class Command {


	constructor (command, description) {
		this.commandData = {};
		this.commandData['command'];
		this.commandData['description'];

	}

	description(description) {
		this.commandData['description'] = description;

		return this;
	}

	help(help) {
		this.commandData['help'] = help;

		return this;
	}

	alias(alias) {
		if (!this.commandData['names']) {
			this.commandData['names'] = [];
		}

		this.commandData['names'].concat(
			(typeof alias !== 'array')?
				[alias]: alias
		);

		return this;
	}

	validate(validation) {
		this.commandData['validation'] = validation;

		return this;
	}

	option() {
		var [option, description, autocomplete] = arguments;

		if (typeof description === 'array') {
			autocomplete = description;
			description = null;
		}

		if (!this.commandData['options']) {
			this.commandData['options'] = [];
		}

		return this;
	}

	action(action) {
		this.commandData['action'] = action;

		return this;
	}

	get(property) {
		return this.commandData['property'];
	}
}
