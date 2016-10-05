const Interpreter = require('../src/Interpreter');

const expect = require('expect');

describe('Interpreter', () => {
	let interpreter;

	beforeEach(function() {
		interpreter = new Interpreter();
	});

	it('should run a simple operation', () => {
		let result = interpreter.runCode('1+1');

		expect(result).toEqual(2);
	});

	it('should run echo command when it is sent', (done) => {
		let stream = interpreter.runCode('echo("test")');

		stream.then((data) => {
			expect(data[0]).toEqual('test\n');
			done();
		});
	});
});
