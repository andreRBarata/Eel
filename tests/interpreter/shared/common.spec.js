const expect = require('expect');
const common = require('../../../app/interpreter/shared/common');

describe('common', () => {
	describe('chainingObject', () => {
		let template;

		beforeEach(() => {
			template = common.chainingObject({
				exampleVariable:
					['exampleVariable'],
				exampleMap:
					['exampleMap', {map : true}],
				exampleMultiple:
					['exampleMultiple', {multiple: true}],
				exampleDefault:
					['exampleDefault', {default: 'test'}]
			});
		});

		describe('Basic variable function', () => {
			it('should set when one parameter is sent', () => {
				template.exampleVariable('test');

				expect(template._exampleVariable)
					.toEqual('test');
			});

			it('should get when no parameters are sent', () => {
				template.exampleVariable('test');

				expect(template.exampleVariable())
					.toEqual('test');
			});
		});

		describe('Map variable function', () => {
			it('should add when to parameters are sent', () => {
				template.exampleMap('test', 'test');

				expect(template._exampleMap.get('test'))
					.toEqual('test');
			});

			it('should get by key when one parameter is sent', () => {
				template.exampleMap('test', 'test');

				expect(template.exampleMap('test'))
					.toEqual('test');
			});

			it('should get map when no parameters are sent', () => {
				template.exampleMap('test', 'test');

				expect(template.exampleMap())
					.toEqual(new Map([['test', 'test']]));
			});
		});

		describe('Multiple variable function', () => {
			it('should add when one parameter sent', () => {
				template.exampleMultiple('test');

				expect(template._exampleMultiple)
					.toEqual(['test']);
			});

			it('should get array when no parameters are sent', () => {
				template.exampleMultiple('test');

				expect(template.exampleMultiple())
					.toEqual(['test']);
			});
		});

		it('default should be set', () => {
			expect(template._exampleDefault)
				.toEqual('test')
		});


	});
});
