/**
 * @summary Class that wraps a commands execution.
 * Is compatible with Streams and Promises
 *
 * @author André Barata
 */

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
	* 	@param {{parent, preprocessor}} config
	*/
	constructor(...args) {
		let stdin = new Highland();

		if (Type.is(args[0], Function) && args.length < 2) {
			args.push({});
		}
		let [config, source] = args.reverse();

		super({
			read(size) {},
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

		this.state = 'unpiped';

		this.config(config);

		if (source) {
			source({
				push: (data) => this.push(data),
				emit: (event, data) =>
					this.emit(event, data),
				stdin: stdin,
				stdout: Highland
					.pipeline((s) =>
						s.errors(
							(err, push) =>
								this.emit('error', err))
						.each((data) =>
							this.push(data))
						.done(() => super.end())
					)
			});
		}


		this.end = () => {
			stdin.end();
		}
	}

	//TODO: Write test id:39
	/**
	*	Consume stream on completion
	*	@param {Function} callback
	*	@returns {Process}
	*/
	then(callback) {
		let data = [];

		this.state = 'consumed';

		this.on('readable', () => {
			let chunk;
			while (chunk = this.read()) {
				data.push(chunk);
			}
		})
		.on('end', () => {
			if (data.length === 1) {
				callback(data[0]);
			}
			else {
				callback(data);
			}
		});

		return this;
	}

	/**
	*	Consume errors on completion
	*	@param {Function} callback
	*	@returns {Process}
	*/
	catch(callback) {
		let errors = [];

		this.on('error', (err) => errors.push(err))
			.on('end', () => callback(errors));

		return this;
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
	* 	@param {{parent, preprocessor}} config - Config object
	* 	@returns {Process}
	*/
	config(configs) {
		let {parent, preprocessor} = configs;

		if (preprocessor) {
			this._preprocessor =
				preprocessor;
		}
		//TODO: Consider change to embed stream model id:23
		if (parent && this.state === 'unpiped') {
			parent.write(this);
		}

		Object.keys(configs).forEach((attr) => {
			if (!(attr in ['parent', 'preprocessor'])) {
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

		this.state = 'piping';

		if (mapper) {
			return super.pipe(mapper)
				.pipe(destination, options);
		}

		return super.pipe(destination, options);
	}

	//TODO: Warning for readonly processes id:2
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
