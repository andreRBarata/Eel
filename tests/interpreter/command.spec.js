const expect	= require('expect');
const Highland	= require('highland');
const command	= require('../../src/interpreter/command');

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

		it('should write into stream nested stream', (done) => {
			let sysoutMock = Highland.pipeline(
				Highland.each((data) => {
					expect(data).toEqual({
						test: {
							test: []
						},
						test2: []
					});
					done();
				}
			));

			let echofunc = echo
				.action(({}, push) => {
					push({
						test: {
							test: []
						},
						test2: []
					});
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
			try {
				echo.arguments('<test.. [test2] <test3>');
			}
			catch (err) {
				expect(err).toBeAn(Error);
			}
		});

		it('should add arguments list', (done) => {
			echo
				.arguments('<test...> [test2] <test3>')
				.action(() => {
					done();
				});

			expect(echo.arguments()).toInclude({
				min: 2,
				max: '*',
				string: '<test...> [test2] <test3>'
			});

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
