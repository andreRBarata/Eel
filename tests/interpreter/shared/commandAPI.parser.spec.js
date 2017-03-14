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
					variables.required().parse('<test>')
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
					variables.required().parse('<test...>')
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
					variables.optional().parse('[test]')
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
					variables.optional().parse('[test...]')
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
					value: {
						id: 'a',
						type: 'shortflag',
						fullflag: '-a'
					}
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
					value: {
						id: 'page',
						type: 'longflag',
						fullflag: '--page'
					}
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
					value: {
						name: 'page',
						flags: [
							{
								id: 'page',
								type: 'longflag',
								fullflag: '--page'
							}, {
								id: 'p',
								type: 'shortflag',
								fullflag: '-p'
							}
						]
					}
				});
			});

			it('should match a list of flags with a parameter', () => {
				expect(
					commandAPI.options
						.flaglist.parse('--page, -p <pagenumber>')
				).toInclude({
					status: true,
					value: {
						name: 'page',
						flags: [
							{
								id: 'page',
								type: 'longflag',
								fullflag: '--page'
							}, {
								id: 'p',
								type: 'shortflag',
								fullflag: '-p'
							}
						],
						variable: 'required'
					}
				});
			});

			it('should match a list of flags with multiword flag', () => {
				expect(
					commandAPI.options
						.flaglist.parse('-p, --page-numbers')
				).toInclude({
					status: true,
					value: {
						name: 'pageNumbers',
						flags: [
							{
								id: 'p',
								type: 'shortflag',
								fullflag: '-p'
							},
							{
								id: 'page-numbers',
								type: 'longflag',
								fullflag: '--page-numbers'
							}
						]
					}
				});
			});

			it('should match a list of flags with a multiword flag and a longflag', () => {
				expect(
					commandAPI.options
						.flaglist.parse('-p, --page, --page-numbers')
				).toInclude({
					status: true,
					value: {
						name: 'pageNumbers',
						flags: [
							{
								id: 'p',
								type: 'shortflag',
								fullflag: '-p'
							},
							{
								id: 'page',
								type: 'longflag',
								fullflag: '--page'
							},
							{
								id: 'page-numbers',
								type: 'longflag',
								fullflag: '--page-numbers'
							}
						]
					}
				});
			});

			describe('with variable', () => {
				let flags;

				before(() => {
					flags = commandAPI.options
						.flaglist.parse('-p, --page <number>');
				});

				it('should create the flag description', () => {
					expect(flags).toInclude({
						status: true,
						value: {
							name: 'page',
							flags: [
								{
									id: 'p',
									type: 'shortflag',
									fullflag: '-p'
								},
								{
									id: 'page',
									type: 'longflag',
									fullflag: '--page'
								}
							]
						}
					});
				});

				describe('parser', () => {
					//#Done: Fix symbols id:33
					it('should parse the shortflag', () => {
						let result = flags.value
							.parser.parse('-p');

						expect(result).toEqual({
							status: true,
							value: {
								name: 'page',
								next: true,
								value: true
							}
						});
					});

					it('should parse the shortflag with variable', () => {
						let result = flags.value
							.parser.parse('-p=1');

						expect(result).toEqual({
							status: true,
							value: {
								name: 'page',
								next: false,
								value: '1'
							}
						});
					});
				});
			});

		});
	});

	describe('headerArgs', () => {
		it('should parse single variable', () => {
			expect(
				commandAPI.headerArgs.parse('<test>')
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
				commandAPI.headerArgs.parse('<test> [test2...] <test3>')
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
