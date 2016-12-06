const Highland			= require('highland');
const stream			= require('stream');
const streamToPromise	= require('stream-to-promise');
const Type				= require('type-of-is');

class Process {
	/**
	*	@callback ProcessGenerator
	*	@param {Function} push - Push item into process, null to end it
	*	@param {Function} emit - emit event in process
	*	@param {Highland} input - Stream that in inputed into process
	*/

	//TODO: Create from function to generate Processes id:12
	//TODO: Add read only process id:13
	//TODO: Seperate config from "from" function
	/**
	*	@param {ProcessGenerator|Array|Number|string|stream.Readable} [source]
	* 	@param {{defaultOutput: Stream}} config
	*/
	constructor(source, config) {
		this.stdout = new stream.Readable({
			read() {},
			objectMode: true
		});
		this.stdin = new Highland();

		if (arguments.length && !Type.is(arguments[0], Object)) {
			return Process.from(...arguments);
		}
		else if (Type.is(arguments[0], Object)) {
			this.config(arguments[0]);
		}
	}

	//TODO: Write description
	// Stream Compatibility
	on(...args) {
		return this.stdout.on(...args);
	}

	once(...args) {
		return this.stdout.once(...args);
	}

	removeListener(...args) {
		return this.stdout.removeListener(...args);
	}

	end() {
		this.stdin.end();
	}

	emit(...args) {
		return this.stdout.emit(...args)
	}

	write(chunk, encoding, callback) {
		return this.stdin.write(chunk, encoding, callback);
	}



	/**
	*	Turns process output into promise
	* 	@return {Promise}
	*/
	toPromise() {
		if (this._defaultOutput) {
			this.stdout.unpipe(this._defaultOutput);
		}

		return streamToPromise(this.stdout);
	}

	/**
	*	Sets configurations for the process
	* 	@param {{defaultOutput: Stream}} config - Config object
	*/
	config(config = {}) {
		if (config.defaultOutput) {
			this._defaultOutput =
				config.defaultOutput;

			this.pipe(config.defaultOutput, { end: false });
		}
	}

	//#Done: Alter function to use standard chaining id:14
	/**
	*	Pipe Current processes output into
	*	other processes input
	*	@param {Process} process - The process to pipe into.
	*	@return {Process}
	*/
	pipe(...args) {
		if (this._defaultOutput) {
			this.stdout.unpipe(this._defaultOutput);
		}

		return this.stdout.pipe(...args);
	}

	//TODO: Add tests for pipeline id:0
	//TODO: Complete pipeline method id:1
	//TODO: Warning for readonly processes id:2
	/**
	*	Pipe processes together
	* 	@static
	*	@param {Function|Array|Number|string|stream.Readable} args - Processes to be piped
	*	@return {Process}
	*/
	static pipeline(...args) {
		let first = false;
		let previous;
		let toReturn = new Process();
		let processes = args
			.map((e) => {
				if (e.pipe) {
					return e;
				}
				else if (Type.is(e, String)) {
					return Highland.of(e);
				}
				else {
					return new Highland(e);
				}
			});

		for (let obj of processes) {
			if (!first) {
				first = obj;
			}

			if (previous) {
				previous.pipe(obj);
			}

			previous = obj;
		}

		toReturn.stdout = previous;
		toReturn.stdin = first;

		return toReturn;
	}

	//#Done: Create from function for Process id:16
	//TODO: Pass system variable to generator function id:28
	/**
	*	Create a process for an object
	*	@static
	*	@param {Function|Array|Number|string|stream.Readable} source - The source for the process
	*	@param {Object} config - Config for the creation
	*	@return {Process}
	*/
	static from(source = null, config = {}) {
		if (!Type.any(source,
			[String, Function, Number, Array, stream.Readable])) {
				return null;
		}

		let toReturn = new Process();

		toReturn.config(config);

		if (Type.is(source, Function)) {
			source(
				(data) => toReturn.stdout.push(data),
				(event) => toReturn.stdout.emit(event),
				process.stdin
			);

			return toReturn;
		}
		else {
			toReturn.readonly = true;

			if (Type.is(source, stream.Readable)) {
				let item;
				while ((item = source.read()) !== null) {
					toReturn.stdout.push(item);
				}
			}
			else if (source[Symbol.iterator] && !Type.is(source, String)) {
				for (let item of source) {
					toReturn.stdout.push(item);
				}
			}
			else {
				toReturn.stdout.push(source);
			}

			toReturn.stdout.push(null);

			return toReturn;
		}
	}
}

module.exports = Process;
