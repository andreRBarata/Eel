const expect	= require('expect');
const Highland	= require('highland');
const command	= require('../../app/interpreter/command');

describe('command', () => {
	let echo;

	beforeEach(() => {
		echo = command('echo', 'outputs a string');
	});

	it('should return function with correct description', () => {
		expect(echo.description())
			.toEqual('outputs a string');
	});

	describe('generated function', () => {
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
					.action(({_:[path]}) => {
						expect(path).toEqual('./test');
						done();
					});

				echo.toFunction()('./test');
			}
		);

		it('should pipe into defaultOutput', (done) => {
			let sysoutMock = Highland.pipeline(
				Highland.each((data) => {
					expect(data).toEqual('test');
					done();
				}
			));

			let echofunc = echo
				.action(({}, push) => {
					push('test');
					push(null);
				})
				.toFunction(sysoutMock)();
		});

		it('should pipe into other generated function', (done) => {
			let sysoutMock = Highland.pipeline(
				Highland.each((data) => {
					expect(data).toNotEqual('test');
				}
			));

			let ls = command('ls')
				.action(({$stdin}) => {
					$stdin.toArray((received) => {
						expect(received).toEqual(['test']);
						done();
					});
				})
				.toFunction(sysoutMock);

			let echofunc = echo
				.action(({}, push) => {
					push('test');
					push(null);
				})
				.toFunction(sysoutMock)();

			echofunc.pipe(ls());
		});
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
			echo.display('text/json',
				`{{variable}}`
			).action(() => {
				done();
			});

			expect(echo.display('text/json')).toEqual(
				`{{variable}}`
			);

			echo.toFunction()();
		});
	});
});
