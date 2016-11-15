const Highland	= require('highland');
const stream	= require('stream');

class Process {

	//TODO: Create from function to generate Processes id:12
	//TODO: Add read only process id:13
	constructor() {
		if (arguments.length) {
			return Process.from(...arguments);
		}

		this.stdout = new stream.Readable({
			read() {}
		});
		this.stdin = new Highland();

		this.stdout.on('end', () => this.stdin.end());
	}

	/**
	* 	Write into input pipe
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

		if (this._defaultOutput) {
			this.stdout.unpipe(this._defaultOutput);
		}

		return process;
	}

	//FIXME
	/**
	*	Add callback to be used when the process
	*	is complete
	*	@param {Function} onFulfilled
	*	@param {Function} onRejected
	*/
	then(onFulfilled, onRejected) {
		(new Highland(this.stdout))
			.toArray(onFulfilled, onRejected);
	}

	//TODO: Add tests for Process.catch function id:15
	catch(onRejected) {
		(new Highland(this.stdout))
			.errors((err, push) => {
				onRejected(err);
				push();
			});
	}

	//TODO: Add tests for pipeline id:0
	//TODO: Complete pipeline method id:1
	//TODO: Warning for readonly processes id:2
	/**
	*	Pipe processes together
	* 	@static
	*	@param {Process[]} args - Processes to be piped
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

	//TODO: Create from function for Process id:16
	/**
	*	Create a process for an object
	*	@static
	*	@param {Function|Array|string|Promise|stream.Readable} source - The source for the process
	*	@return {Process}
	*/
	static from(source, config = {}) {
		let process = new Process();

		function setConfig(_config) {
			if (_config.defaultOutput) {
				process._defaultOutput =
					_config.defaultOutput;

				process.stdout
					.pipe(_config.defaultOutput);
			}
		}

		setConfig(config);

		switch (source.constructor) {
			case Object: {
				setConfig(source);

				return process;
			}
			case Function: {
				source(
					(data) => process.stdout.push(data),
					(event) => process.stdout.emit(event),
					process.stdin
				);

				return process;
			}
			case String: {
				process.stdout.push(source);

				return process;
			}
			case Array:
			case Promise:
			case stream.Readable: {
				(new Highland(source))
					.each(
						(data) => process.stdout.push(data)
					);
				process.readonly = true;

				return process;
			}
		}

		return null;
	}
}

module.exports = Process;
