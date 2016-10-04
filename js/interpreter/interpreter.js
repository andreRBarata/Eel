const Command = require('./Command');
const Process = require('./Process');


const homedir = require('homedir');


let environment = {
	'cwd': homedir(),
	'env': {}
};


let interpreter = {
	commands: [],
	defaultCommand: null,
	use(module) {
		require(module)(interpreter);
	},
	command(command = '', description = '') {
		let newCommand = interpreter.find(command);

		if (!newCommand) {
			newCommand = new Command(command, description);

			interpreter.commands.push(newCommand);
		}

		return newCommand;
	},
	catch(command = '', description = '') {
		let newCommand = interpreter.command(command, description);

		interpreter.defaultCommand = newCommand;

		return newCommand;
	},
	//TODO: Move code to new terminal object
	exec(command = '', argsString = '') {

	}
};

module.exports = interpreter;
