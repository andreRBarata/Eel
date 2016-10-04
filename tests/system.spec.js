const expect = require('expect');

const Process = require('../Process');
const system = require('../system')({});

const forEach = require('mocha-each');


describe('system', () => {

	it('should return error to stdout if command does not exist', (done) => {
		system.thisCommandDoesNotExist().catch((err) => {
			expect(err).toBeAn(Error);
			done();
		});/*.stdout.errors((err) => {
			expect(err).toBeAn(Error);
			done();
		})**/;
	});

	describe('man command', () => {
		//FIXME: Fix test
		it('should place error in output stream if has no arguments', () => {

		});
	});

	describe('echo command', () => {
		it('should output "test" when sent as parameter', (done) => {
			system.echo('test').stdout.each((data) => {
					expect(data).toEqual('test\n');
					done();
				}
			);
		});
	});
	describe('cat command', () => {
		it('should output "test" when written in the input pipe', (done) => {
			let command = system.cat();

			command.stdout.each((data) => {
					expect(data).toEqual('test');
					done();
				}
			);

			command.input('test');
			command.stdin.end();
		});

		it('should output "test" when piped from process object', (done) => {
			let process = new Process();
			let command = system.cat().pipe(process);

			command.stdin.on('data', (data) => {
					expect(data).toEqual('test');
			});

			command.stdout.on('data', (data) => {
					expect(data).toEqual('test');
					done();
			});

			process.stdout.write('test');
			process.stdout.end();
		});

		it('should output "test" when piped from echo', (done) => {
			let command = system.cat().pipe(system.echo('test'));

			command.stdout.on('data', (data) => {
					expect(data).toEqual('test\n');
					done();
				}
			);
		});
	});
});
