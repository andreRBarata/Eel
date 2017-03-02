angular.module('termApp')
	.controller('mainController', ($scope, $window, vm, historyService) => {
		let firstRun = false;

		$scope.process = vm._context
			.process;
		$scope.cwd = process.cwd();
		$scope.command = '';

		$scope.firstRun = () => {
			historyService.get()
				.toArray((history) => {
					firstRun = history.length === 0;
				});

			return firstRun;
		};

		$scope.firstRun();

		$scope.process
			.stdout.on('cwdchange', (cwd) => {
				$scope.cwd = cwd;
				$scope.$apply();
			});

		$scope.scrollDown = () =>
			window.scrollTo(0, document.body.scrollHeight);

		$scope.execute = (command) => {
			$scope.process
				.stdout.write({
					html: `<input-highlight command="src" readonly="true"></input-highlight>`,
					scope: command
				});

			try {
				vm.run(command);

				if (command && command !== '') {
					historyService
						.push(command);
				}
			}
			catch (err) {
				$scope.process
					.stdout.emit('error', err);

			}
		};
	});
