const Highland	= require('highland');
const Stream	= require('stream');

class Process {
	//TODO: Create from function to generate Processes
	//TODO: Add read only process
	constructor(source) {
		if (!source) {
			this.stdout = new Highland();
			this.stdin = new Highland();
		}
		else {
			return Process.from(source);
		}

	}

	/**
	*	Write into input pipe
	*	@param {string} value - Value to be piped in.
	*/
	input(value) {
		this.stdin.write(value);
	}

	//#ForThisSprint:40 Alter function to use standard chaining
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


	/**
	*	Add callback to be used when the process
	*	is complete
	*	@param {Function} onFulfilled
	*	@param {Function} onRejected
	*/
	then(onFulfilled, onRejected) {
		this.stdout.toArray(onFulfilled, onRejected);
	}

	//TODO:30 Add tests for Process.catch function
	catch(onRejected) {
		this.stdout.errors((err, push) => {
			onRejected(err);
			push();
		});
	}

	//TODO: Create from function for Process
	//#Done: Stop the return of invalid sources and create tests
	/**
	*	Create a process for an object
	*	@static
	*	@param {Function|Array|String|Promise|Readable Stream} source - The source for the process
	*	@returns {Process}
	*/
	static from(source) {
		let process = new Process();

		switch (source.constructor) {
			case Function: {
				process.stdout = new Highland((push, next) => {
					source(push, next, process.stdin);
				});

				return process;
			}
			case Array:
			case String:
			case Promise:
			case Stream.Readable: {
				process.stdout = new Highland(source);
				process.readonly = true;

				return process;
			}
		}

		return null;
	}

	//TODO: Add tests for pipeline
	//TODO: Complete pipeline method
	static pipeline(...args) {
		let lastElement;

		args.reverse().forEach((element) => {
			if (!lastElement) {
				lastElement = element;
			}
			else if (element) {

			}
		});
	}
}

module.exports = Process;
