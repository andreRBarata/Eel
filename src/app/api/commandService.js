/**
*	Manages the execution of commands
*	and the connection to the sandbox/back-end
*	@author André Barata
*/
const Highland			= require('highland');
const vm				= require('../../interpreter/vm');
const historyService	= require('./historyService');

const { tag, helpers } = require('vue-vnode-helper');
const {  } = helpers;

module.exports = (() => {
	let vmInstance = vm.getInstance();
	let commandService = {
		stdout: new Highland(),
		vmInstance: vmInstance,
		execute(command) {
			this.stdout.write(
				tag('codemirror', {'v-model': command})
			);

			try {
				this.vmInstance.run(command);
			}
			catch (err) {
				this.stdout
					.write(err);
			}
			finally {
				if (command && command !== '') {
					historyService
						.push(command);
				}
			}
		}
	};

	vmInstance._context
		.process
		.stdout.pipe(
			commandService.stdout
		);

	vmInstance._context
		.process
		.stdout.on('cwdchange', (cwd) => {
			commandService.stdout
				.emit('cwdchange', cwd);
		});

	vmInstance._context
		.process
		.stdout.on('error', (err) => {
			commandService.stdout
				.write(err);
		});

	return commandService;
})();
