const expect	= require('expect');
const forEach	= require('mocha-each');
const Highland	= require('highland');


const Process	= require('../../src/interpreter/Process');



describe('context', () => {
	let context;
	let system;

	describe('status emitter', () => {

		before(() => {
			context = require('../../src/interpreter/context')
				.getInstance();
		});

		it('should emit a load event', (done) => {

			context.status.when('loaded', () => {
				done();
			});

		});
	});

	describe('system', () => {
		beforeEach((done) => {
			let context = require('../../src/interpreter/context')
				.getInstance();

			context.status.when('loaded', () => {
				system = context.system;
				done();
			});
		});

		it('should throw error if command does not exist', () => {
			try {
				system.thisCommandDoesNotExist();
			}
			catch(err) {
				expect(err).toBeAn(Error);
			}
		});

		describe('man command', () => {
			//#ForThisSprint: Complete tests for man command error propagation id:19
			it('should place error in output stream if has no arguments', (done) => {
				system.man().toPromise().catch((err) => {
					expect(err).toBeAn(Error);
					done();
				});
			});
		});

		describe('echo command', () => {
			describe('then function', () => {
				it('should output "test" when sent as parameter', (done) => {
					system.echo('test').toPromise().then((data) => {
							expect(data).toEqual(['test']);
							done();
						}
					);
				});
			});

			describe('stdout.once function', () => {
				it('should output "test" when sent as parameter', (done) => {
					system.echo('test')
						.stdout.once('data', (data) => {
							expect(data).toEqual('test');
							done();
						}
					);
				});
			});

			it('should output "test" through system stdout when sent as parameter', (done) => {
				context.stdout.once('data', (data) => {
						expect(data).toEqual('test');
						done();
					}
				);

				system.echo('test');
			});

		});

		describe('cat command', () => {
			it('should output "test" when written in the input pipe', (done) => {
				let command = system.cat();

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

				command = process.pipe(system.cat());

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

			//#ForThisSprint: Alter tests for different pipes id:20
			it('should output "test" when piped from echo', (done) => {
				let command = system.echo('test').pipe(system.cat());

				command.toPromise().then((data) => {
						expect(data).toEqual('test');
						done();
					}
				);
			});
		});
	});

});
