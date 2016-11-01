const expect	= require('expect');

const StateMachine	= require('../../src/shared/StateMachine');

describe('StateMachine', () => {
	let stateMachine;

	beforeEach(() => {
		stateMachine = new StateMachine({
			initial: 'unloaded',
			states: {
				unloaded: ['loaded']
			}
		});
	});

	describe('when function', () => {
		it('should throw Error if state does not exist', () => {
			try {
				stateMachine.when('sdsd', () => {});
			}
			catch (e) {
				expect(e).toBeAn(Error);
			}
		});
	});

});
