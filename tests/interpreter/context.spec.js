const expect	= require('expect');

const Process	= require('../../src/interpreter/Process');



describe('context', () => {
	let context;

	beforeEach((done) => {
		context = require('../../src/interpreter/context')
			.getInstance();

		context.when('loaded', () => {
			done();
		});
	});

	it('should throw error if command does not exist', () => {
		try {
			context.thisCommandDoesNotExist();
		}
		catch(err) {
			expect(err).toBeAn(Error);
		}
	});

	describe('man command', () => {
		it('should place error in output stream if has no arguments', (done) => {
			context.man().toPromise().catch((err) => {
				expect(err).toBeAn(Error);
				done();
			});
		});
	});

	describe('echo command', () => {
		describe('then function', () => {
			it('should output "test" when sent as parameter', (done) => {
				context.echo('test').toPromise().then((data) => {
						expect(data).toEqual(['test\n']);
						done();
					}
				);
			});
		});

		describe('once function', () => {
			it('should output "test" when sent as parameter', (done) => {
				context.echo('test')
					.once('data', (data) => {
						expect(data).toEqual('test\n');
						done();
					}
				);
			});
		});

		it('should output "test" through system stdout when sent as parameter', (done) => {
			context.stdout.once('data', (data) => {
					expect(data).toEqual('test\n');
					done();
				}
			);

			context.echo('test');
		});

	});

	describe('cat command', () => {
		it('should output "test" when written in the input pipe', (done) => {
			let command = context.cat();

			command.toPromise().then((data) => {
					expect(data).toEqual('test');
					done();
				}
			);


			command.write('test');
		});

		it('should output "test" when piped from process object', (done) => {
			let command;
			let process = new Process();

			process.stdout.push('test');

			command = process.pipe(context.cat());

			command.stdin
				.once('data', (data) => {
					expect(data).toEqual('test');
				});

			command.stdout
				.once('data', (data) => {
					expect(data).toEqual('test');
					done();
				});


		});

		//#TODO:40 Alter tests for different pipes id:20
		it('should output "test" when piped from echo', (done) => {
			let command = context.echo('test').pipe(context.cat());

			command.toPromise().then((data) => {
					expect(data).toEqual('test\n');
					done();
				}
			);
		});
	});

});
