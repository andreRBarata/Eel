const expect	= require('expect');
const forEach	= require('mocha-each');

const Process 	= require('../src/Process');

describe('Process', () => {
	let process;

	beforeEach(function() {
		process = new Process();
	});

	it('should call Promise when written on and ended', (done) => {
		process.then((data) => {
			expect(data).toEqual('test');
			done();
		});

		process.stdout.write('test');
		process.stdout.end();

	});

	describe('"out" stream', () => {
		it('should call callback is done', (done) => {
			process.stdout
				.done(() => done());

			process.stdout.write('test');
			process.stdout.end();
		});

		it('should call callback is done with toArray', (done) => {
			process.stdout
				.toArray((array) => {
					expect(array).toEqual(['test']);
					done();
				});

			process.stdout.write('test');
			process.stdout.end();
		});

		it('should call callback when written on', (done) => {
			process.stdout.each((data) => {
				expect(data).toEqual('test');
				done();
			});

			process.stdout.write('test');
			process.stdout.end();
		});
	});

	describe('"in" stream', () => {
		it('should call callback when written on through the input function',
			(done) => {
				process.stdin.each((data) => {
					expect(data).toEqual('test');
					done();
				});

				process.input('test');
			}
		);

		it('should call callback when written on through pipe', (done) => {
			let pipingProcess = new Process();

			process.stdin.each((data) => {
				expect(data).toEqual('test');
				done();
			});

			process.pipe(pipingProcess);

			pipingProcess.stdout.write('test');
		});
	});
});
