const expect	= require('expect');
const forEach	= require('mocha-each');
const Highland	= require('highland');

const Process 	= require('../../src/interpreter/Process');

describe('Process', () => {

	it('should write nested object in Process object', () => {
		let workProcess = new Process(({push}) => {
			push({
				test: {
					test: {}
				},
				test2: []
			});
		}).on('data', (obj) => {
			expect(obj).toEqual({
				test: {
					test: {}
				},
				test2: []
			});
		});
	});

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

	it('should pipe into stdout', (done) => {
		let workProcess = new Process(({stdin}) => {
			stdin.once('data', (data) => {
				expect(data).toEqual('test');
				done();
			});
		});
		let output = new Process(({stdout}) => {
			Highland.of('test').pipe(stdout);
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

	//#Done: Add tests for pipeline id:0
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
			let parent = new Process(({stdin}) => {
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
			}, {parent: parent});

			Process.pipe(output, workProcess);
		});

		it('should create pipe between processes with a default output and a preprocessor', (done) => {
			let parent = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toNotEqual('testtest');
				});
			});
			parent.parent = true;


			let workProcess = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toEqual('testtest');
					done();
				});
			});

			let output = new Process({
				parent: parent,
				preprocessor: (dest) => Highland.pipeline(
					Highland.map((arg) => 'test' + arg)
				)
			});

			Process.pipe(output, workProcess);

			output.push('test');
		});

		it('should create pipe between processes with a default output and an empty preprocessor', (done) => {
			let parent = new Process(({stdin}) => {
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
				parent: parent,
				preprocessor: (dest) => {}
			});

			Process.pipe(output, workProcess);

			output.push('test');
		});

		it('should create pipe between processes with a default output and an empty preprocessor that closes stream at the end', (done) => {
			let parent = new Process(({stdin}) => {
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
				parent: parent,
				preprocessor: (dest) => {}
			});

			Process.pipe(output, workProcess);

			output.push('test');
			output.push(null);
		});

		it('should create pipe between processes with a default output and a preprocessor that closes stream at the end', (done) => {
			let parent = new Process(({stdin}) => {
				stdin.once('data', (data) => {
					expect(data).toNotEqual('test');
				});
			});
			parent.parent = true;

			let workProcess = new Process(({stdin}) => {
				stdin.toArray(([data]) => {
					expect(data).toEqual('testtest');
					done();
				});
			});

			let output = new Process({
				parent: parent,
				preprocessor: (dest) => Highland.pipeline(
					Highland.map((arg) => 'test' + arg)
				)
			});

			Process.pipe(output, workProcess);

			output.push('test');
			output.push(null);
		});
	});

	it('should call then when written on and ended', (done) => {
		let workProcess = new Process(({push}) => {
			push('test');
			push(null);
		});
		workProcess.then((data) => {
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

		workProcess.then((data) => {
			expect(data).toNotEqual('test');

		}).catch((err) => {
			expect(err).toBeAn(Error);
			done();
		});
	});
});
