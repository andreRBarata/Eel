const Highland = require('highland');

class Process {

	constructor() {
		this.stdout = new Highland();
		this.stdin = new Highland();
	}

	/**
	*	Write into input pipe
	*	@param {string} value - Value to be piped in.
	*/
	input(value) {
		this.stdin.write(value);
	}

	/**
	*	Pipe Current processes output into
	*	other processes input
	*	@param {Process} process - The process to pipe into.
	*	@returns {Process}
	*/
	pipe(process) {
		process.stdout.pipe(this.stdin);

		return process;
	}

	//#ForThisSprint:40 Alter function to use standard chaining
	/**
	*	Add callback to be used when the process
	*	is complete
	*	@param {Function} onFulfilled
	*	@param {Function} onRejected
	*/
	then(onFulfilled, onRejected) {
		this.stdout.toArray(onFulfilled, onRejected);
	}

	//TODO:20 Add tests for Process.catch function
	catch(onRejected) {
		this.stdout.errors((err, push) => {
			onRejected(err);
			push();
		});
	}
}

module.exports = Process;
