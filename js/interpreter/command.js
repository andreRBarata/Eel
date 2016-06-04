//Add option for parameter decontructor
module.exports = (() => {
	var parser = require('./parser');
	console.log(parser);
	var commandData = {
		'format': '',
		'description': '',
		'help': '',
		'validation': null,//function
		'option': {},
		'action': null,//function
		'deconstructor': null
	};

	function Command(formatstring, description) {
		this.command = Object.assign({}, commandData);

		this.command.description = description;

		if (!this.command.args) {
			this.command.args = {};
		}

		var args = parser.parseExpectedArgs(formatstring);

		this.command.format = parser.getArgsLiteral(formatstring);

		for (var key of Object.keys(args)) {
			this.command.args[key] = args[key];
		}
	}

	Command.prototype.exec = function(args, callback) {
		this.action()(this.deconstructor()(args), callback);
	};

	//TODO: Finish this function
	Command.prototype.option = function() {
		var option, description, autocomplete;

		if (arguments.length <= 2) {
			option = arguments[0];
			autocomplete = arguments[1];
		}
		else {
			[option, description, autocomplete] = arguments;
		}

		if(description instanceof Array) {
			autocomplete = description;
			description = null;
		}

		return this;
	};

	//TODO: Fix this
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
