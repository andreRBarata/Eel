const expect	= require('expect');

const parsers	= require('../../../src/interpreter/shared/parsers');

describe('parsers', () => {
	describe('command', () => {
		let command = parsers.command;

		describe('variables', () => {
			let variables = command.variables;

			describe('single', () => {
				it('should parse a single word', () => {
					expect(
						variables.single.parse('test')
					).toEqual(
						{status: true, value: {name: 'test'}}
					);
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
							name: 'test'
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
							name: 'test'
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
							required: true
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
	});
});
