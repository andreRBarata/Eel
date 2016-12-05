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

		this.on = (...args) => this.stdout.on(...args);
		//this.stdout.on('end', () => this.stdin.end());
	}

	/**
	*	Turns process output into promise
	* 	@return {Promise}
	*/
	toPromise() {
		this.stdout.unpipe(this._defaultOutput);

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

			this.stdout
				.pipe(config.defaultOutput);
		}
	}

	/**
	* 	Write into input pipe
	*	@param {string} value - Value to be piped in.
	*/
	input(value) {
		this.stdin.write(value);
	}

	//#Done: Alter function to use standard chaining id:14
	/**
	*	Pipe Current processes output into
	*	other processes input
	*	@param {Process} process - The process to pipe into.
	*	@return {Process}
	*/
	pipe(process) {
		if (process.readonly) {
			return new Error('Cannot pipe into readonly process');
		}

		this.stdout.pipe(process.stdin);

		if (this._defaultOutput) {
			this.stdout.unpipe(this._defaultOutput);
		}

		return process;
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
		let process = new Process();
		let processes = args
			.map((e) => (!e.pipe)? Process.from(e): e)
			.reverse();

		for (let obj of processes) {
			let tmp = obj;

			if (!first) {
				first = tmp;
			}
			if (previous) {
				previous.pipe(tmp);
			}


			previous = tmp;
		}


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

		let process = new Process();

		process.config(config);

		if (Type.is(source, Function)) {
			source(
				(data) => process.stdout.push(data),
				(event) => process.stdout.emit(event),
				process.stdin
			);

			return process;
		}
		else {
			process.readonly = true;

			if (Type.is(source, stream.Readable)) {
				let item;
				while ((item = source.read()) !== null) {
					process.stdout.push(item);
				}
			}
			else if (source[Symbol.iterator]) {
				for (let item of source) {
					process.stdout.push(item);
				}
			}
			else {
				process.stdout.push(source);
			}

			process.stdout.push(null);

			return process;
		}
	}
}

module.exports = Process;
