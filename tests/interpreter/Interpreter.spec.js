const expect		= require('expect');

const Interpreter	= require('../../src/interpreter/Interpreter');

//#ForThisSprint:30 Write more Interpreter tests id:17
describe('Interpreter', () => {
	let interpreter;

	beforeEach((done) => {
		interpreter = new Interpreter();

		interpreter
			.when('loaded', () => done());

	});

	it('should have a isNaN function', () => {
		expect(interpreter.runCode(`isNaN('test')`)).toEqual(true);
	});

	it('should run a simple operation', () => {
		let result = interpreter.runCode('1+1');

		expect(result).toEqual(2);
	});

	it('should run echo command when it is sent', (done) => {
		interpreter.runCode(`echo('test')`);

		interpreter.stdout.on('data', (data) => {
			expect(data).toEqual('test\n');
			done();
		});
	});
});
