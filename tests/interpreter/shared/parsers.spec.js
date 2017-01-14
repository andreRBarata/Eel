const expect	= require('expect');

const parsers	= require('../../../src/interpreter/shared/parsers');

describe.only('parsers', () => {
	describe('command', () => {
		let command = parsers.command;

		describe('variables', () => {
			let variables = command.variables;

			describe('single', () => {
				it('should parse a single word', () => {
					expect(
						variables.single.parse('test')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							multiple: false
						}
					});
				});
			});

			describe('multiple', () => {
				it('should parse a word with the spread indicator', () => {
					expect(
						variables.multiple.parse('test...')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							multiple: true
						}
					});
				});
			});

			describe('required', () => {
				it('should parse a required parameter', () => {
					expect(
						variables.required.parse('<test>')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							multiple: false,
							required: true
						}
					});
				});

				it('should parse a required parameter with the spread indicator', () => {
					expect(
						variables.required.parse('<test...>')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							multiple: true,
							required: true
						}
					});
				});
			});

			describe('optional', () => {
				it('should parse a optional parameter', () => {
					expect(
						variables.optional.parse('[test]')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							required: false,
							multiple: false
						}
					});
				});

				it('should parse a optional parameter with the spread indicator', () => {
					expect(
						variables.optional.parse('[test...]')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							required: false,
							multiple: true
						}
					});
				});
			});

			describe('variable', () => {
				it('should parse a optional parameter', () => {
					expect(
						variables.variable.parse('[test]')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							required: false,
							multiple: false
						}
					});
				});

				it('should parse a optional parameter with the spread indicator', () => {
					expect(
						variables.variable.parse('[test...]')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							required: false,
							multiple: true
						}
					});
				});

				it('should parse a required parameter', () => {
					expect(
						variables.variable.parse('<test>')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							required: true,
							multiple: false
						}
					});
				});

				it('should parse a required parameter with the spread indicator', () => {
					expect(
						variables.variable.parse('<test...>')
					).toEqual({
						status: true,
						value: {
							name: 'test',
							multiple: true,
							required: true
						}
					});
				});
			});
		});

		describe('args', () => {
			it('should parse single variable', () => {
				expect(
					command.args.parse('<test>')
				).toEqual({
					status: true,
					value: [
						{
							name: 'test',
							required: true,
							multiple: false
						}
					]
				});
			});

			it('should parse multiple variables', () => {
				expect(
					command.args.parse('<test> [test2...] <test3>')
				).toEqual({
					status: true,
					value: [
						{
							name: 'test',
							required: true,
							multiple: false
						},
						{
							name: 'test2',
							required: false,
							multiple: true
						},
						{
							name: 'test3',
							required: true,
							multiple: false
						}
					]
				});
			});
		});
	});

	describe('vm', () => {
		let vm = parsers.vm;

		describe('shell', () => {
			let shell = vm.shell;

			describe('args', () => {
				it('should parse text', () => {
					expect(shell.args.parse('test'))
						.toEqual({status: true, value: ['\'test\'']})
				});

				it('should parse a string', () => {
					expect(shell.args.parse('"test test"'))
						.toEqual({status: true, value: ['\"test test\"']})
				});

				it('should parse a template variable', () => {
					expect(shell.args.parse('${test}'))
						.toEqual({status: true, value: ['test']})
				});
			});

			describe('command', () => {

				it('should parse simple command', () => {
					expect(shell.command.parse('#ls'))
						.toEqual({status: true, value: '$sys[\'ls\']()'})
				});

				it('should parse command with arguments', () => {
					expect(shell.command.parse('#ls src'))
						.toEqual({status: true, value: `$sys['ls']('src')`})
				});

				it('should parse command with a variable', () => {
					expect(shell.command.parse('#ls ${src}'))
						.toEqual({status: true, value: `$sys['ls'](src)`})
				});
			});
		});

		describe('templateVariable', () => {
			it('should parse a variable', () => {
				expect(vm.templateVariable.parse('${test}'))
					.toEqual({status: true, value: ['${', 'test', '}']})
			});
		});

		describe('expression', () => {
			it('should parse a simple variable', () => {
				expect(vm.expressions.parse('test'))
					.toEqual({status: true, value: 'test'})
			});

			it('', () => {
				expect(vm.expressions.parse('let test = #ls;'))
					.toEqual({status: true, value: `let test = $sys['ls']();`})
			});
		});
	});
});
