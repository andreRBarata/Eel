const expect	= require('expect');
const eelscript	= require('../../../src/interpreter/shared/eelscript.parser');

describe('Eelscript parser', () => {

	describe('shell', () => {
		let shell = eelscript.shell;

		describe('args', () => {
			it('should parse text', () => {
				expect(shell.args.parse('test'))
					.toEqual({status: true, value: ['\'test\'']});
			});

			it('should parse a string', () => {
				expect(shell.args.parse('"test test"'))
					.toEqual({status: true, value: ['\"test test\"']});
			});

			it('should parse a template variable', () => {
				expect(shell.args.parse('${test}'))
					.toEqual({status: true, value: ['test']});
			});
		});

		describe('command', () => {

			it('should parse simple command', () => {
				expect(shell.command.parse('#ls'))
					.toEqual({status: true, value: '$sys[\'ls\']()'});
			});

			it('should parse command with arguments', () => {
				expect(shell.command.parse('#ls src'))
					.toEqual({status: true, value: `$sys['ls']('src')`});
			});

			it('should parse command with a variable', () => {
				expect(shell.command.parse('#ls ${src}'))
					.toEqual({status: true, value: `$sys['ls'](src)`});
			});
		});
	});

	describe('templateVariable', () => {
		it('should parse a variable', () => {
			expect(eelscript.templateVariable.parse('${test}'))
				.toEqual({status: true, value: ['${', 'test', '}']});
		});
	});

	//TODO: Fix tests id:15
	describe('templateString', () => {
		it('should parse a template string', () => {
			expect(eelscript.templateString.parse('`test`'))
				.toEqual({status: true, value: `"test"`});
		});

		it('should parse a string and escape the template command', () => {
			expect(eelscript.templateString.parse('`\\${test}`'))
				.toEqual({status: true, value: `"\\\${test}"`});
		});

		it('should parse a template variable', () => {
			expect(eelscript.templateString.parse('`${test}`'))
				.toEqual({status: true, value: '""+(test)+""'});
		});

		it('should parse a template command', () => {
			expect(eelscript.templateString.parse('`${#ls}`'))
				.toEqual({status: true, value: '""+($sys[\'ls\']())+""'});
		});

		it('should parse a string and a template command', () => {
			expect(eelscript.templateString.parse('`test${#ls}`'))
				.toEqual({status: true, value: '"test"+($sys[\'ls\']())+""'});
		});

		it('should parse a template string with escaped backtick', () => {
			expect(eelscript.templateString.parse('`\\``'))
				.toEqual({status: true, value: `"\\\`"`});
		});
	});

	describe('string', () => {
		it('should parse singlequote with escaped singlequote', () => {
			expect(eelscript.string.parse(`'\\''`))
				.toEqual({status: true, value: `'\\''`});
		});

		it('should parse doublequote with escaped doublequote', () => {
			expect(eelscript.string.parse(`"\\""`))
				.toEqual({status: true, value: `"\\""`});
		});

	});

	describe('expression', () => {

		it('should parse a simple variable', () => {
			expect(eelscript.expressions.parse('test'))
				.toEqual({status: true, value: 'test'});
		});

		it('should parse a template variable', () => {
			expect(eelscript.expressions.parse('`${test}`'))
				.toEqual({status: true, value: '""+(test)+""'});
		});

		it('should parse a system command assignment', () => {
			expect(eelscript.expressions.parse('let test = #ls;'))
				.toEqual({status: true, value: `let test = $sys['ls']();`});
		});

		it('should parse an empty singlequote string', () => {
			expect(eelscript.expressions.parse(`''`))
				.toEqual({status: true, value: `''`});
		});

		it('should parse an empty doublequote string', () => {
			expect(eelscript.expressions.parse(`""`))
				.toEqual({status: true, value: `""`});
		});

		it('should parse a negation', () => {
			expect(eelscript.expressions.parse(`!true`))
				.toEqual({status: true, value: `!true`});
		});

		it('should parse two near by strings', () => {
			expect(eelscript.expressions.parse(`''['']`))
				.toEqual({status: true, value: `''['']`});
		});
	});

});
