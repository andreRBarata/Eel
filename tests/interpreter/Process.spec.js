const expect	= require('expect');
const forEach	= require('mocha-each');
const Highland	= require('highland');

const Process 	= require('../../src/interpreter/Process');

describe('Process', () => {
	let workProcess;

	beforeEach(() => {
		workProcess = new Process();
	});

	it('should be receive pipe from Highland Stream', (done) => {
		Highland.of('test').pipe(workProcess);

		workProcess.stdin.once('data', (data) => {
			expect(data).toEqual('test');
			done();
		});
	});

	it('should be receive pipe from other process', (done) => {
		let output = new Process((push, emit, input) => {
				push('test');
				push(null);
			});

		output.pipe(workProcess);

		workProcess.stdin.once('data', (data) => {
			expect(data).toEqual('test');
			done();
		});

	});

	it('should create Process with elements if an function is sent', (done) => {
		let testProcess = new Process((push, emit, input) => {
			push('test');
			push(null);
		});

		expect(testProcess).toNotEqual(null);

		testProcess.toPromise().then((array) => {
			expect(array).toEqual(['test']);
			done();
		}).catch((err) => {
			console.log('Error:', err);
		});
	});

	//#ForThisSprint:10 Add tests for pipeline id:0
	describe('"pipeline" function', () => {

		it('');
	});

	describe('"toPromise" function', () => {

		it('should call then when written on and ended', (done) => {
			workProcess.toPromise().then((data) => {
				expect(data[0]).toEqual('test');
				done();
			});

			workProcess.stdout.push('test');
			workProcess.stdout.push(null);

		});

		it('should call catch when error emitted', (done) => {
			workProcess.toPromise().then((data) => {
				expect(data[0]).toNotEqual('test');

			}).catch((err) => {
				expect(err).toBeAn(Error);
				done();
			});

			workProcess.stdout.push('test');
			workProcess.stdout.emit('error', new Error('error'));

		});
	});

	describe('"out" stream', () => {
		it('should call callback when written on', (done) => {
			workProcess.stdout.once('data', (data) => {
				expect(data).toEqual('test');
				done();
			});

			workProcess.stdout.push('test');
			workProcess.stdout.push(null);
		});
	});

	describe('"in" stream', () => {
		it('should call callback when written on through the input function', (done) => {
				workProcess.stdin.once('data', (data) => {
					expect(data).toEqual('test');
					done();
				});

				workProcess.write('test');
			}
		);

		it('should call callback when written on through pipe', (done) => {
			let pipingProcess = new Process();

			workProcess.stdin.once('data', (data) => {
				expect(data).toEqual('test');
				done();
			});

			pipingProcess.pipe(workProcess);

			pipingProcess.stdout.push('test');
		});

		it('should call not pipe to defaultOutput if other pipe is made', (done) => {
			let defaultPipe = new Highland();
			let pipedProcess = new Process({
				defaultOutput: defaultPipe
			});

			workProcess.pipe(pipedProcess);

			defaultPipe.once('data', (data) => {
				expect(data).toNotEqual('test');
			});

			pipedProcess.stdin.once('data', (data) => {
				expect(data).toEqual('test');
				done();
			});

			workProcess.stdout.push('test');
		});
	});
});
