const expect		= require('expect');

const Interpreter	= require('../src/Interpreter');

//TODO: Write more Interpreter tests
describe('Interpreter', () => {
	let interpreter;

	beforeEach((done) => {
		interpreter = new Interpreter();

		interpreter.status
			.once('load', () => done());
	});

	it('should have a isNaN function', () => {
		expect(interpreter.runCode(`isNaN('test')`)).toEqual(true);
	});

	it('should run a simple operation', () => {
		let result = interpreter.runCode('1+1');

		expect(result).toEqual(2);
	});

	//#TODO:20 Discover why echo function not defined
	it.skip('should run echo command when it is sent', (done) => {
		interpreter.runCode(`echo('test')`);

		interpreter.context.stdout.each((data) => {
			expect(data[0]).toEqual('test\n');
			done();
		});
	});
});
