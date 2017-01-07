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

			it('should create function which executes action with converted arguments when ran',
				(done) => {
					echo
					.arguments('<path>')
					.action((push, args, input) => {
						console.log(args);
						expect(args.path).toEqual('./test');
						done();
					});

					echo.toFunction()('./test');
				}
			);
		});

		describe('"arguments" function', () => {
			it('should return error is arguments are invalid', () => {
				expect(
					echo.arguments('<test.. [test2] <test3>')
				).toBeAn(Error);
			});

			it('should add arguments list', (done) => {
				echo
					.arguments('<test...> [test2] <test3>')
					.action(() => {
						done();
					});

				expect(echo.arguments()).toEqual([
					{
						name: 'test',
						multiple: true,
						required: true
					},
					{
						name: 'test2',
						multiple: false,
						required: false
					},
					{
						name: 'test3',
						multiple: false,
						required: true
					}
				]);

				echo.toFunction()();
			});
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
