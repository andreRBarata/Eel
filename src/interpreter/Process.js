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
		super({
			read(){},
			write(chunk, encoding, callback) {
				stdin.write(chunk);
				callback();
			},
			writev(){},
			objectMode: true
		});

		if (Type.is(arguments[0], Function)) {
			arguments[0]({
				push: (data) => this.push(data),
				emit: (event) => this.emit(event),
				stdin: stdin,
				stdout: this//TODO:Replace this
			});

			if (Type.is(arguments[1], Object)) {
				this.config(arguments[1]);
			}
		}
		else if (Type.is(arguments[0], Object)) {
			this.config(arguments[0]);
		}
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
			this.pipe(defaultOutput, { end: false });

			this._defaultOutput =
			defaultOutput;
		}

		for (let attr in Object.keys(configs)) {
			if (configs.hasOwnProperty(attr)) {
				if (!(attr in ['defaultOutput', 'preprocessor'])) {
					this[attr] = rest[attr];
				}
			}
		}

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

		if (this._defaultOutput) {
			super.unpipe(this._defaultOutput);
		}

		if (mapper) {
			return super
				.pipe(mapper)
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
	static pipeline(input, output) {
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
