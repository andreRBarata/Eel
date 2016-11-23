angular.module('termApp')
	.controller('mainController', function($scope, interpreter) {
		$scope.command = '';
		//TODO: Fix all output to the same command error
		$scope.output = [];

		$scope.execute = (keyEvent) => {
			if (keyEvent.which === 13) {
				let screen = {
					'command': $scope.command,
					'results': []
				};

				interpreter.runCode($scope.command);
				interpreter.stdout.each((result) => {
					screen.results.push(result);
					$scope.$apply();
					window.scrollTo(0,document.body.scrollHeight);
				});

				$scope.output.push(screen);

				$scope.command = '';
			}
			console.log($scope.output);
		};
	});
