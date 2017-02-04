const expect		= require('expect');

const commandAPI	= require('../../../src/interpreter/shared/commandAPI.parser');

describe('commandAPI parser', () => {

	describe('variables', () => {
		let variables = commandAPI.variables;

		describe('single', () => {
			it('should parse a single word', () => {
				expect(
					variables.single.parse('test')
				).toInclude({
					status: true,
					value: {
						max: 1,
						string: 'test'
					}
				});
			});
		});

		describe('multiple', () => {
			it('should parse a word with the spread indicator', () => {
				expect(
					variables.multiple.parse('test...')
				).toInclude({
					status: true,
					value: {
						max: '*',
						string: 'test...'
					}
				});
			});
		});

		describe('required', () => {
			it('should parse a required parameter', () => {
				expect(
					variables.required.parse('<test>')
				).toInclude({
					status: true,
					value: {
						max: 1,
						min: 1,
						string: '<test>'
					}
				});
			});

			it('should parse a required parameter with the spread indicator', () => {
				expect(
					variables.required.parse('<test...>')
				).toInclude({
					status: true,
					value: {
						max: '*',
						min: 1,
						string: '<test...>'
					}
				});
			});
		});

		describe('optional', () => {
			it('should parse a optional parameter', () => {
				expect(
					variables.optional.parse('[test]')
				).toInclude({
					status: true,
					value: {
						max: 1,
						min: 0,
						string: '[test]'
					}
				});
			});

			it('should parse a optional parameter with the spread indicator', () => {
				expect(
					variables.optional.parse('[test...]')
				).toInclude({
					status: true,
					value: {
						max: '*',
						min: 0,
						string: '[test...]'
					}
				});
			});
		});

		describe('variable', () => {
			it('should parse a optional parameter', () => {
				expect(
					variables.variable.parse('[test]')
				).toInclude({
					status: true,
					value: {
						max: 1,
						min: 0,
						string: '[test]'
					}
				});
			});

			it('should parse a optional parameter with the spread indicator', () => {
				expect(
					variables.variable.parse('[test...]')
				).toEqual({
					status: true,
					value: {
						max: '*',
						min: 0,
						string: '[test...]'
					}
				});
			});

			it('should parse a required parameter', () => {
				expect(
					variables.variable.parse('<test>')
				).toEqual({
					status: true,
					value: {
						max: 1,
						min: 1,
						string: '<test>'
					}
				});
			});

			it('should parse a required parameter with the spread indicator', () => {
				expect(
					variables.variable.parse('<test...>')
				).toInclude({
					status: true,
					value: {
						max: '*',
						min: 1,
						string: '<test...>'
					}
				});
			});
		});
	});

	describe('options', () => {
		describe('shortflag', () => {
			it('should match shortflag', () => {
				expect(
					commandAPI.options
						.shortflag.parse('-a')
				).toInclude({
					status: true,
					value: ['-', 'a']
				});
			});
		});

		describe('longflag', () => {
			it('should match longflag', () => {
				expect(
					commandAPI.options
						.longflag.parse('--page')
				).toInclude({
					status: true,
					value: ['--', 'page']
				});
			});
		});

		describe('flaglist', () => {
			it('should match a list of flags', () => {
				expect(
					commandAPI.options
						.flaglist.parse('--page, -p')
				).toInclude({
					status: true,
					value: [['--', 'page'], ['-', 'p']]
				});
			});
		});
	});

	describe('args', () => {
		it('should parse single variable', () => {
			expect(
				commandAPI.args.parse('<test>')
			).toInclude({
				status: true,
				value: {
					max: 1,
					min: 1,
					string: '<test>'
				}
			});
		});

		it('should parse multiple variables', () => {
			expect(
				commandAPI.args.parse('<test> [test2...] <test3>')
			).toInclude({
				status: true,
				value: {
					max: '*',
					min: 2,
					string: '<test> [test2...] <test3>'
				}
			});
		});
	});
});
