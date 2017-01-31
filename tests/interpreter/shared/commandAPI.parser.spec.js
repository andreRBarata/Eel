const expect		= require('expect');

const commandAPI	= require('../../../src/interpreter/shared/commandAPI.parser');

describe('commandAPI parser', () => {

	describe('variables', () => {
		let variables = commandAPI.variables;

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
				commandAPI.args.parse('<test>')
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
				commandAPI.args.parse('<test> [test2...] <test3>')
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
