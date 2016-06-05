//Add option for parameter decontructor
module.exports = (() => {
	var parser = require('./parser');
	var commandData = {
		'format': '',
		'description': '',
		'help': '',
		'validation': null,//function
		'option': {},
		'action': null,//function
	};

	function Command(formatstring, description) {
		var args;
		this.command = Object.assign({}, commandData);

		this.command.description = description;

		if (args && !this.command.args) {
			this.command.args = {};
		}

		args = parser.parseExpectedArgs(formatstring);

		this.command.format = parser.getArgsLiteral(formatstring);

		for (var key of Object.keys(args)) {
			this.command.args[key] = args[key];
		}
	}

	//TODO:30 Make usage of streams
	Command.prototype.exec = function(args, callback) {
		var decontructedArgs;

		if (!this.command.args) {
			decontructedArgs = args.match(/(".*"|\'.*\'|\S+)/g);
		}
		console.log(decontructedArgs, args);
		this.action()(decontructedArgs, callback);
	};

	//TODO:40 Finish option function
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
