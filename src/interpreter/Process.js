const Highland			= require('highland');
const stream			= require('stream');
const streamToPromise	= require('stream-to-promise');
const Type				= require('type-of-is');

/**
*	@callback ProcessGenerator
*	@param {{
*		push: Function,
*		emit: Function,
*		stdin: Highland,
*		stdout: Stream
*	}}
*/

class Process extends stream.Duplex {
	/**
	*	@param {ProcessGenerator} [source]
	* 	@param {{defaultOutput, preprocessor}} config
	*/
	constructor(source, config) {
		let stdin = new Highland();
		let stdout = new stream.Readable({
			read() {},
			objectMode: true
		});
		super({
			read(size) {
				return stdout.read(size);
			},
			write(chunk, encoding, callback) {
				stdin.write(chunk);
				callback();
			},
			writev(chunks, callback) {
				stdin.writev(chunks, callback);
				callback();
			},
			objectMode: true
		});
		this.stdin = stdin;
		this.stdout = stdout;

		if (Type.is(arguments[0], Function)) {
			arguments[0]({
				push: (data) => this.push(data),
				emit: (event) => this.emit(event),
				stdin: stdin,
				stdout: Highland.pipeline(
					Highland.each(
						(data) => this.push(data)
					)
				)
			});

			if (Type.is(arguments[1], Object)) {
				this.config(arguments[1]);
			}
		}
		else if (Type.is(arguments[0], Object)) {
			this.config(arguments[0]);
		}
	}

	end() {
		this.stdin.end();
	}

	/**
	*	Turns process output into promise
	* 	@returns {Promise}
	*/
	toPromise() {
		if (this._defaultOutput) {
			super.unpipe(this._defaultOutput);
		}

		return streamToPromise(this);
	}

	/**
	*	Sets configurations for the process
	* 	@param {{defaultOutput, preprocessor}} config - Config object
	* 	@returns {Process}
	*/
	config(configs) {
		let {defaultOutput, preprocessor} = configs;

		if (preprocessor) {
			this._preprocessor =
				preprocessor;
		}
		if (defaultOutput) {
			let mapper = (this._preprocessor)?
				this._preprocessor(defaultOutput): null;
			let link = (mapper)?
				this.pipe(mapper): this;

			link.on('data', (data) => {
				let hasOtherlisteners =
					this.listeners('data')
						.length === ((mapper)? 1: 0);

				if (hasOtherlisteners) {
					defaultOutput.write(data);
				}
			});
		}

		Object.keys(configs).forEach((attr) => {
			if (!(attr in ['defaultOutput', 'preprocessor'])) {
				this[attr] = configs[attr];
			}
		});

		return this;
	}

	//TODO: Fix possible memmory leak
	/**
	*	Pipe Current processes output into
	*	other processes input
	*	@param {Process} process - The process to pipe into.
	*	@returns {Process}
	*/
	pipe(destination, options) {
		let mapper = (this._preprocessor)?
			this._preprocessor(destination): null;

		if (mapper) {
			return super.pipe(mapper)
				.pipe(destination, options);
		}

		return super.pipe(destination, options);
	}

	//TODO:150 Warning for readonly processes id:2
	/**
	*	Pipe processes together
	* 	@static
	*	@param {Function|Array|Number|string|stream.Readable} args - Processes to be piped
	*	@returns {Process}
	*/
	static pipe(input, output) {
		function asStream(stream) {
			if (!input.pipe) {
				if (Type.is(input, String)) {
					return Highland.of(input);
				}
				else {
					return new Highland(input);
				}
			}
			else {
				return stream;
			}
		}

		return asStream(input).pipe(asStream(output));
	}
}

module.exports = Process;
