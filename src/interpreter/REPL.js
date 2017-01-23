const repl			= require('repl');
const Writable		= require('stream').Writable;

const vm	= require('./vm');


repl.start({
	prompt: '> ',
	eval: (cmd, context, filename, callback) => {
		callback(null,
			vm.run(cmd)
		);
	}
});

//vm.stdout.on('data', (text) => process.stdout.write(`${text}\n`));
