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
	constructor(...args) {
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

		if (Type.is(arguments[0], Function)) {
			arguments[0]({
				push: (data) => this.push(data),
				emit: (event, data) =>
					this.emit(event, data),
				stdin: stdin,
				stdout: Highland
					.pipeline((s) =>
						s.errors(
							(err, push) =>
								this.emit('error', err)
						).each((data) =>
							this.push(data)
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

		this.end = () => stdin.end();
	}

	/**
	*	Turns process output into promise
	* 	@returns {Promise}
	*/
	toPromise() {
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
				Process.pipe(this, mapper): this;

			if (!this._defaultOutput) {
				let hasNoOtherlisteners = () => {
					return this.listeners('data')
						.length <= ((mapper)? 1: 0);
				}

				link.on('data', (data) => {
					if (hasNoOtherlisteners() && this._defaultOutput) {
						this._defaultOutput
							.write(data);
					}
				});

				link.on('error', (err) => {
					if (hasNoOtherlisteners() && this._defaultOutput) {
						this._defaultOutput
							.emit('error', err);
					}
				});
			}

			this._defaultOutput = defaultOutput;
		}

		Object.keys(configs).forEach((attr) => {
			if (!(attr in ['defaultOutput', 'preprocessor'])) {
				this[attr] = configs[attr];
			}
		});

		return this;
	}

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
	static pipe(_input, _output) {
		function asStream(stream) {
			if (!stream.pipe) {
				if (Type.is(stream, String)) {
					return Highland.of(stream);
				}
				else {
					return new Highland(stream);
				}
			}
			else {
				return stream;
			}
		}
		let input = asStream(_input);
		let output = asStream(_output);

		input.on('error', (err) =>
			output.emit('error', err)
		);

		return input.pipe(output);
	}
}

module.exports = Process;
