angular.module('termApp')
	.controller('mainController',
		($scope, commandService, historyService) => {
			let firstRun = false;

			$scope.stdout = commandService
				.stdout;
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

			$scope.stdout
				.on('cwdchange', (cwd) => {
					$scope.cwd = cwd;
					$scope.$apply();
				});

			$scope.execute = (command) =>
				commandService.execute(command);
		});
