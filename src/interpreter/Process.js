const Highland			= require('highland');
const stream			= require('stream');
const streamToPromise	= require('stream-to-promise');
const Type				= require('type-of-is');

/**
*	@callback ProcessGenerator
*	@param {Function} push - Push item into process, null to end it
*	@param {Function} emit - emit event in process
*	@param {Highland} stdin - Stream that in inputed into process
*/

class Process {
	//TODO:120 Pass system variable to generator function id:28
	/**
	*	@param {ProcessGenerator} [source]
	* 	@param {{defaultOutput: Stream}} config
	*/
	constructor(...args) {
		this.stdout = new stream.Readable({
			read() {},
			objectMode: true
		});
		this.stdin = new Highland();

		if (Type.is(args[0], Function)) {
			args[0]({
				push: (data) => this.stdout.push(data),
				emit: (event) => this.stdout.emit(event),
				stdin: this.stdin,
				stdout: this.stdout	
			});

			if (Type.is(args[1], Object)) {
				this.config(args[1]);
			}
		}
		else if (Type.is(args[0], Object)) {
			this.config(args[0]);
		}
	}

	/**
	*	Turns process output into promise
	* 	@returns {Promise}
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
	* 	@returns {Process}
	*/
	config(config = {}) {
		if (config.defaultOutput) {
			this._defaultOutput =
				config.defaultOutput;

			this.pipe(config.defaultOutput, { end: false });
		}

		return this;
	}

	/**
	*	Pipe Current processes output into
	*	other processes input
	*	@param {Process} process - The process to pipe into.
	*	@returns {Process}
	*/
	pipe(...args) {
		if (this._defaultOutput) {
			this.stdout.unpipe(this._defaultOutput);
		}

		return this.stdout.pipe(...args);
	}

	//TODO:150 Warning for readonly processes id:2
	/**
	*	Pipe processes together
	* 	@static
	*	@param {Function|Array|Number|string|stream.Readable} args - Processes to be piped
	*	@returns {Process}
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

		//TODO:170 Write this better
		toReturn.stdout = previous;
		toReturn.stdin = first;

		return toReturn;
	}

	//TODO:160 Write description
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
		return this.stdout.emit(...args);
	}

	write(chunk, encoding, callback) {
		return this.stdin.write(chunk, encoding, callback);
	}
}

module.exports = Process;
