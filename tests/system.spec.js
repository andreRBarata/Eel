const expect = require('expect');

const Process = require('../src/Process');
const system = require('../src/system')({
	'$env': process.env
});

const forEach = require('mocha-each');


describe('system', () => {

	it('should return error to stdout if command does not exist', () => {
		try {
			system.thisCommandDoesNotExist();
		}
		catch(err) {
			expect(err).toBeAn(Error);
		}
	});

	describe('man command', () => {
		//TODO:30 Complete tests for man command error propagation
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

		//#ForThisSprint:60 Alter tests for different pipes
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
