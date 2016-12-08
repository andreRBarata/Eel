const expect	= require('expect');
const command	= require('../../src/interpreter/command');

describe('command', () => {
	it('should return function with correct description', () => {
		let echo = command('echo <string>', 'outputs a string');

		expect(echo.description())
			.toEqual('outputs a string');
	});

	describe('returned', () => {
		let echo;

		beforeEach(() => {
			echo = command('echo <string>', 'outputs a string');
		});

		it('should run action on execution', (done) => {
			echo.action(() => {
				done();
			});

			echo();
		});
	});
});
