const expect	= require('expect');

const StateMachine	= require('../../../src/interpreter/shared/StateMachine');

describe('StateMachine', () => {
	let stateMachine;

	beforeEach(() => {
		stateMachine = new StateMachine({
			initial: 'unloaded',
			states: {
				unloaded: ['loaded'],
				superloaded: ['unloaded']
			}
		});
	});

	describe('"go" function', () => {
		it('should change state if state transition is valid', () => {
			stateMachine.go('loaded');

			expect(stateMachine.currentState).toEqual('loaded');
		});

		it('should emit event if state transition is valid', (done) => {
			stateMachine.once('loaded', () => {
				done();
			});

			stateMachine.go('loaded');
		});


		it('should throw error if state transition is not valid', () => {
			try {
				stateMachine.go('unloaded');
			}
			catch (err) {
				expect(err).toBeAn(Error);
			}
		
		});
	});

	describe('"when" function', () => {
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
