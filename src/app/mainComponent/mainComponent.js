const storage = require('electron-storage');

angular.module('termApp')
	.controller('mainController', ($scope, $window, vm) => {
		$scope.process = vm._context
			.process;
		$scope.cwd = process.cwd();
		$scope.command = '';
		$scope.history = [];

		$scope.scrollDown = () =>
			window.scrollTo(0, document.body.scrollHeight);

		$scope.process
			.stdout.on('cwdchange', (cwd) => {
				$scope.cwd = cwd;
				$scope.$apply();
			});

		storage.get('history')
			.then((data) => $scope.history = data)
			.catch(() => {
				storage.set('history', $scope.history);
			});

		$window.addEventListener('beforeunload', () => {
			storage.set('history', $scope.history);
		});

		$scope.execute = (command) => {
			$scope.process
				.stdout.write({
					html: `<input-highlight command="src" readonly="true"></input-highlight>`,
					scope: command
				});

			try {
				vm.run(command);

				if (!$scope.history.includes(command)) {
					$scope.history
						.push(command);
				}
			}
			catch (err) {
				$scope.process
					.stdout.emit('error', err);

			}
		};
	});
