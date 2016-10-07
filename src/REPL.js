const repl			= require('repl');
const Writable		= require('stream').Writable;

const Interpreter	= require('./Interpreter');


let interpreter = new Interpreter();

repl.start({
	prompt: '> ',
	eval: (cmd, context, filename, callback) => {
		callback(null,
			interpreter.runCode(cmd)
		);
	}
});

interpreter.stdout.each((text) => process.stdout.write(`${text}\n`));
//#Done:0 Find out provide access to standard js functions using a proxy context and implement it
//#Done:30 Join outputed stream to standard output to have it display values
