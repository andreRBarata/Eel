const expect	= require('expect');
const forEach	= require('mocha-each');
const Highland	= require('highland');

const Process 	= require('../../src/interpreter/Process');

describe('Process', () => {


	it('should be receive pipe from Highland Stream', (done) => {
		let workProcess = new Process(({stdin}) => {
			stdin.once('data', (data) => {
				expect(data).toEqual('test');
				done();
			});
		});
		Highland.of('test').pipe(workProcess);
	});

	it('should be receive pipe from other process', (done) => {
		let workProcess = new Process(({stdin}) => {
			stdin.once('data', (data) => {
				expect(data).toEqual('test');
				done();
			});
		});
		let output = new Process(({push}) => {
				push('test');
				push(null);
			});

		output.pipe(workProcess);

	});

	it('should create Process with elements if an function is sent', (done) => {
		let testProcess = new Process(({push}) => {
			push('test');
			push(null);
		});

		expect(testProcess).toNotEqual(null);

		testProcess.toPromise().then((data) => {
			expect(data).toEqual('test');
			done();
		}).catch((err) => {
			console.log('Error:', err);
		});
	});

	//#ForThisSprint:10 Add tests for pipeline id:0
	describe('static "pipe" function', () => {
		it('should create pipe between processes', (done) => {
			let workProcess = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toEqual('test');
					done();
				});
			});
			let output = new Process(({push}) => {
				push('test');
				push(null);
			});

			Process.pipe(output, workProcess);
		});

		it('should create pipe between processes with a preprocessor', (done) => {
			let workProcess = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toEqual('testtest');
					done();
				});
			});
			let output = new Process(({push}) => {
				push('test');
				push(null);
			}, {
				preprocessor: (dest) => Highland.pipeline(
					Highland.map((arg) => 'test' + arg)
				)
			});

			Process.pipe(output, workProcess);
		});

		it('should create pipe between processes with a default output', (done) => {
			let defaultOutput = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toNotEqual('test');
				});
			});


			let workProcess = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toEqual('test');
					done();
				});
			});

			let output = new Process(({push}) => {
				push('test');
				push(null);
			}, {defaultOutput: defaultOutput});

			Process.pipe(output, workProcess);

			expect(output._defaultOutput).toBeFalsy();
		});

		it('should create pipe between processes with a default output and a preprocessor', (done) => {
			let defaultOutput = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toNotEqual('testtest');
				});
			});
			defaultOutput.defaultOutput = true;


			let workProcess = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toEqual('testtest');
					done();
				});
			});

			let output = new Process({
				defaultOutput: defaultOutput,
				preprocessor: (dest) => Highland.pipeline(
					Highland.map((arg) => 'test' + arg)
				)
			});

			Process.pipe(output, workProcess);
			expect(output._defaultOutput).toBeFalsy();

			output.push('test');
		});

		it('should create pipe between processes with a default output and an empty preprocessor', (done) => {
			let defaultOutput = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toNotEqual('test');
				});
			});

			let workProcess = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toEqual('test');
					done();
				});
			});

			let output = new Process({
				defaultOutput: defaultOutput,
				preprocessor: (dest) => {}
			});

			Process.pipe(output, workProcess);

			expect(output._defaultOutput).toBeFalsy();

			output.push('test');
		});

		it('should create pipe between processes with a default output and an empty preprocessor that closes stream at the end', (done) => {
			let defaultOutput = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toNotEqual('test');
				});
			});

			let workProcess = new Process(({stdin}) => {
				stdin.toArray(([data]) => {
					expect(data).toEqual('test');
					done();
				});
			});

			let output = new Process({
				defaultOutput: defaultOutput,
				preprocessor: (dest) => {}
			});

			Process.pipe(output, workProcess);

			expect(output._defaultOutput).toBeFalsy();

			output.push('test');
			output.push(null);
		});

		it('should create pipe between processes with a default output and a preprocessor that closes stream at the end', (done) => {
			let defaultOutput = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toNotEqual('test');
				});
			});
			defaultOutput.defaultOutput = true;

			let workProcess = new Process(({stdin}) => {
				stdin.toArray(([data]) => {
					expect(data).toEqual('testtest');
					done();
				});
			});

			let output = new Process({
				defaultOutput: defaultOutput,
				preprocessor: (dest) => Highland.pipeline(
					Highland.map((arg) => 'test' + arg)
				)
			});

			Process.pipe(output, workProcess);

			expect(output._defaultOutput).toBeFalsy();

			output.push('test');
			output.push(null);
		});
	});

	describe('"toPromise" function', () => {

		it('should call then when written on and ended', (done) => {
			let workProcess = new Process(({push}) => {
				push('test');
				push(null);
			});
			workProcess.toPromise().then(([data]) => {
				expect(data).toEqual('test');
				done();
			});
		});

		it('should call catch when error emitted', (done) => {
			let workProcess = new Process(({push, emit}) => {
				push('test');
				emit('error', 'Test');
				push(null);
			});

			workProcess.toPromise().then((data) => {
				expect(data[0]).toNotEqual('test');

			}).catch((err) => {
				expect(err).toBeAn(Error);
				done();
			});
		});
	});

	/*describe('"out" stream', () => {
		it('should call callback when written on', (done) => {
			let workProcess = new Process(({push, emit}) => {
				push('test');
				emit('error', 'test')
				push(null);
			});
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
	});*/
});
