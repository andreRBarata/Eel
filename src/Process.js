const Highland	= require('highland');
const Stream	= require('stream');

class Process {
	//TODO: Create from function to generate Processes id:12
	//TODO: Add read only process id:13
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

	//#ForThisSprint: Alter function to use standard chaining id:14
	/**
	*	Pipe Current processes output into
	*	other processes input
	*	@param {Process} process - The process to pipe into.
	*	@return {Process}
	*/
	pipe(process) {
		this.stdout.pipe(process.stdin);

		return process;
	}

	//FIXME
	/**
	*	Set default output stream during process
	*	@param {Highland} stream - Default output stream
	*/
	defaultOutput(stream) {
		this.stdout.on('end', () => {
			if (!this.stdout._consumers.length) {
				this.stdout.pipe(stream, {end: false});
			}
		});
	}

	//TODO: Add tests for pipeline id:0
	//TODO: Complete pipeline method id:1
	//TODO: Warning for readonly processes id:2
	/**
	*	Pipe processes together
	*	@param {---Process} args - Processes to be piped
	*	@return {Process}
	*/
	static pipeline(...args) {
		let lastElement;

		args.reverse().forEach((element) => {
			if (!lastElement) {
				lastElement = element;
			}
			else if (element) {
				lastElement.pipe(element);
			}
		});

		return args[0];
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

	//TODO: Add tests for Process.catch function id:15
	catch(onRejected) {
		this.stdout.errors((err, push) => {
			onRejected(err);
			push();
		});
	}

	//TODO: Create from function for Process id:16
	/**
	*	Create a process for an object
	*	@static
	*	@param {Function|Array|string|Promise|Readable Stream} source - The source for the process
	*	@return {Process}
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
}

module.exports = Process;
