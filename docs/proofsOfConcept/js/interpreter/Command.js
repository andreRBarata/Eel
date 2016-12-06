//Add option for parameter decontructor
const parser = require('./parser');

let commandData = {
	'format': [],
	'description': '',
	'help': '',
	'validation': null,//function
	'option': {},
	'action': null,//function
};

class Command {

	constructor(formatstring, description) {
		let args;

		this.command = Object.assign({}, commandData);
		this.command.description = description;

		if (formatstring) {
			args = parser.parseExpectedArgs(formatstring);
			this.command.format = parser.commandComponents(formatstring);
		}

		this.command.args = args || {};
	}

	//TODO:300 Make usage of streams
	exec(args, environment, callback) {
		let decontructedArgs;

		if (Object.keys(this.command.args).length === 0) {
			decontructedArgs = args.match(/(".*"|\'.*\'|\S+)/g);
		}
		else {
			//TODO:290 Use minimist and parse module for parameter parse
		}

		this.action()(decontructedArgs, environment, callback);
	}

	//TODO:310 Finish option function
	option() {
		let optionName, description, autocomplete;

		if (arguments.length === 3) {
			[optionName, description, autocomplete] = arguments;
		}
		if (arguments.length <= 2) {
			[optionName, autocomplete] = arguments;
		}
		else if (arguments.length === 0) {
			return this.command.option;
		}

		if (description instanceof Array) {
			autocomplete = description;
			description = null;
		}

		return this;
	}
}

Object.keys(commandData).forEach(
	(field) => {
		if (!Command.prototype[field]) {
			Command.prototype[field] = function(arg) {
				if (!arg) {
					return this.command[field];
				}
				else {
					this.command[field] = arg;
					return this;
				}
			};
		}
	}
);

module.exports = Command;
