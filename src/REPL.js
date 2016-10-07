const repl = require('repl');

const Interpreter = require('./Interpreter');

let interpreter = new Interpreter();

repl.start({
	prompt: '> ',
	eval: (cmd, context, filename, callback) => {
		callback(null,
			interpreter.runCode(cmd)
		);
	}
});


//#Done:0 Find out provide access to standard js functions using a proxy context and implement it
//#ForThisSprint:20 Join outputed stream to standard output to have it display values
