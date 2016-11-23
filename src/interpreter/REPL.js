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

interpreter.stdout.on('data', (text) => process.stdout.write(`${text}\n`));
