//Add option for parameter decontructor
module.exports = (() => {
	var parser = require('./parser');
	var commandData = {
		'format': [],
		'description': '',
		'help': '',
		'validation': null,//function
		'option': {},
		'action': null,//function
	};

	function Command(formatstring, description) {
		var args = parser.parseExpectedArgs(formatstring);

		this.command = Object.assign({}, commandData);
		this.command.description = description;

		if (!this.command.args) {
			this.command.args = {};
		}

		this.command.format = parser.getArgsLiteral(formatstring);

		for (var key of Object.keys(args)) {
			this.command.args[key] = args[key];
		}
	}

	//TODO:30 Make usage of streams
	Command.prototype.exec = (args, environment, callback) => {
		var decontructedArgs;

		if (Object.keys(this.command.args).length === 0) {
			decontructedArgs = args.match(/(".*"|\'.*\'|\S+)/g);
		}
		else {
			//TODO: Use minimist and parse module for parameter parse
		}

		this.action()(decontructedArgs, environment, callback);
	};

	//TODO:40 Finish option function
	Command.prototype.option = () => {
		var optionName, description, autocomplete;

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
	};

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

	return Command;
})();
