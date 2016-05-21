module.exports = class Command {

	constructor(command, description) {
		this.command;
		this.description;
	}

	description(description) {
		this.description = description;

		return this;
	}

	help(help) {
		this.help = help;

		return this;
	}

	alias(alias) {
		if (!this.name) {
			this.name = [];
		}

		this.name.concat(
			(typeof alias !== 'array')?
				[alias]: alias
		);

		return this;
	}

	validate(validation) {
		this.validation = validation;

		return this;
	}

	option() {
		var [option, description, autocomplete] = arguments;

		if (typeof description === 'array') {
			autocomplete = description;
			description = null;
		}

		if (!this.options) {
			this.options = [];
		}

		return this;
	}

	action(action) {
		this.action = action;
	}
}
