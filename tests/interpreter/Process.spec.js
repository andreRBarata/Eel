const expect	= require('expect');
const forEach	= require('mocha-each');
const Highland	= require('highland');

const Process 	= require('../../src/interpreter/Process');

describe('Process', () => {
	let process;

	beforeEach(() => {
		process = new Process();
	});

	it('should be receive pipe from Highland Stream', (done) => {
		Highland.of('test').pipe(process);

		process.stdin.once('data', (data) => {
			expect(data).toEqual('test');
			done();
		});
	});

	it('should be receive pipe from other process', (done) => {
		let output = new Process('test');

		output.pipe(process);

		process.stdin.once('data', (data) => {
			expect(data).toEqual('test');
			done();
		});
	});

	describe('"toPromise" function', () => {

		it('should call then when written on and ended', (done) => {
			process.toPromise().then((data) => {
				expect(data[0]).toEqual('test');
				done();
			});

			process.stdout.push('test');
			process.stdout.push(null);

		});

		it('should call catch when error emitted', (done) => {
			process.toPromise().then((data) => {
				expect(data[0]).toNotEqual('test');

			}).catch((err) => {
				expect(err).toBeAn(Error);
				done();
			});

			process.stdout.push('test');
			process.stdout.emit('error', new Error('error'));

		});
	});

	describe('"out" stream', () => {
		it('should call callback when written on', (done) => {
			process.stdout.once('data', (data) => {
				expect(data).toEqual('test');
				done();
			});

			process.stdout.push('test');
			process.stdout.push(null);
		});
	});

	describe('"in" stream', () => {
		it('should call callback when written on through the input function', (done) => {
				process.stdin.once('data', (data) => {
					expect(data).toEqual('test');
					done();
				});

				process.write('test');
			}
		);

		it('should call callback when written on through pipe', (done) => {
			let pipingProcess = new Process();

			process.stdin.once('data', (data) => {
				expect(data).toEqual('test');
				done();
			});

			pipingProcess.pipe(process);

			pipingProcess.stdout.push('test');
		});

		it('should call not pipe to defaultOutput if other pipe is made', (done) => {
			let defaultPipe = new Highland();
			let pipedProcess = new Process({
				defaultOutput: defaultPipe
			});

			process.pipe(pipedProcess);

			defaultPipe.once('data', (data) => {
				expect(data).toNotEqual('test');
			});

			pipedProcess.stdin.once('data', (data) => {
				expect(data).toEqual('test');
				done();
			});

			process.stdout.push('test');
		});
	});

	describe('"from" function', () => {
		it('should return Process with elements if an array is sent', (done) => {
			let process = Process.from([1,2,3,4]);

			expect(process).toNotEqual(null);

			process.toPromise().then((array) => {
				expect(array).toEqual([1,2,3,4]);
				done();
			}).catch((err) => {
				console.log('Error:', err);
			});
		});

		it('should return Process with elements if an string is sent', (done) => {
			let process = Process.from('test');

			expect(process).toNotEqual(null);

			process.toPromise().then((array) => {
				expect(array).toEqual(['test']);
				done();
			}).catch((err) => {
				console.log('Error:', err);
			});
		});

		it('should return Process with elements if an function is sent', (done) => {
			let process = Process.from((push, emit, input) => {
				push('test');

				push(null);
			});

			expect(process).toNotEqual(null);

			process.toPromise().then((array) => {
				expect(array).toEqual(['test']);
				done();
			}).catch((err) => {
				console.log('Error:', err);
			});
		});
	});
});
