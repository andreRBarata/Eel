angular.module('termApp')
	.controller('mainController', function($scope, interpreter) {
		$scope.command = '';
		//TODO: Fix all output to the same command error
		$scope.output = [];

		interpreter.stdout.each((result) => {
			$scope.output.push(result);
			$scope.$apply();
			window.scrollTo(0,document.body.scrollHeight);
		});

		$scope.execute = (keyEvent) => {
			if (keyEvent.which === 13) {

				$scope.output.push($scope.command);

				interpreter.runCode($scope.command);

				$scope.command = '';
			}
		};
	});
