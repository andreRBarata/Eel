const expect	= require('expect');
const forEach	= require('mocha-each');
const Highland	= require('highland');

const Process 	= require('../src/Process');

describe('Process', () => {
	let process;

	beforeEach(() => {
		process = new Process();
	});

	it('should call Promise when written on and ended', (done) => {
		process.then((data) => {
			expect(data).toEqual('test');
			done();
		});

		process.stdout.push('test');
		process.stdout.push(null);

	});

	describe('"out" stream', () => {

		it('should call callback is done', (done) => {
			process.then(() => done());

			process.stdout.push('test');
			process.stdout.push(null);
		});

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

				process.input('test');
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
});
