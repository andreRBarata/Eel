const Highland	= require('highland');
const vm		= require('../../interpreter/vm');

angular.module('termApp')
	.factory('commandService', (historyService) => {
		let vmInstance = vm.getInstance();
		let commandService = {
			stdout: new Highland(),
			execute(command) {
				commandService
					.stdout.write({
						html: `<input-highlight command="src" readonly="true"></input-highlight>`,
						scope: command
					});

				try {
					vmInstance.run(command);
				}
				catch (err) {
					commandService
						.stdout.write(err);
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
			.stdout.on('cwdchange', (location) => {
				commandService
					.stdout
					.emit('cwdchange', location);
			});

		vmInstance._context
			.process
			.stdout.on('error', (err) => {
				commandService
					.stdout
					.write(err);
			});

		return commandService;
	});
