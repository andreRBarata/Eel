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

				echo();
			}
		);

		it('should create function which executes action with converted arguments when ran',
			(done) => {
				echo
					.usage('<path>')
					.action(({_:[path]}) => {
						expect(path).toEqual('./test');
						done();
					});

				echo('./test');
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
				})()
				.config({defaultOutput: sysoutMock});;
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
				})();
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
				});

			let echofunc = echo
				.action(({}, push) => {
					push('test');
					push(null);
				})()
				.config({defaultOutput: sysoutMock});

			echofunc.pipe(ls());
		});
	});

	describe('"option" function', () => {
		it('it should return a parser that parses an option', (done) => {
			echo.option('--help, -h', 'test')
				.action((args) => {
					done();
				})('--help');
		});
	});

	describe('"usage" function', () => {
		it('should return error is arguments are invalid', () => {
			try {
				echo.usage('<test.. [test2] <test3>');
			}
			catch (err) {
				expect(err).toBeAn(Error);
			}
		});

		it('should add arguments list', () => {
			echo
				.usage('<test...> [test2] <test3>')
				.action(() => {
					done();
				});

			expect(echo.usage()).toInclude({
				min: 2,
				max: '*',
				string: '<test...> [test2] <test3>'
			});
		});

		it('should fail to accept no parameters', (done) => {
			echo
				.usage('<test...>')
				.action(() => {
					done();
				});

			echo().on('error', (err) => {
				expect(err)
					.toBeAn(Error);

				done();
			});

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

			echo();
		});
	});
});
