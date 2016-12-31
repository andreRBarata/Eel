const expect	= require('expect');
const command	= require('../../src/interpreter/command');

describe('command', () => {
	it('should return function with correct description', () => {
		let echo = command('echo', 'outputs a string');

		expect(echo.description())
			.toEqual('outputs a string');
	});

	describe('returned', () => {
		let echo;

		beforeEach(() => {
			echo = command('echo', 'outputs a string');
		});

		describe('"toFunction" function', () => {
			it('should create function which executes action when ran',
				(done) => {
					echo.action(() => {
						done();
					});

					echo.toFunction()();
				}
			);
		});

		describe('"display" function', () => {
			it('should add display template', (done) => {
				echo.display(['text', 'json'],
					`{{variable}}`
				).action(() => {
					done();
				});

				expect(echo.display()).toEqual(
					new Map([
						[['text', 'json'], `{{variable}}`]
					])
				);

				echo.toFunction()();
			});
		});
	});
});
