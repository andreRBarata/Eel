angular.module('termApp')
	.controller('mainController', function($scope, interpreter) {
		$scope.command = '';
		//TODO:190 Fix all output to the same command error
		$scope.output = [];

		//TODO:230 See about treatment of nulls
		interpreter.stdout.each((result) => {
			if (result !== null) {
				$scope.output.push(result);
				$scope.$apply();
				window.scrollTo(0,document.body.scrollHeight);
			}
		});

		$scope.execute = (keyEvent) => {
			if (keyEvent.which === 13) {

				$scope.output.push($scope.command);

				console.log(interpreter.runCode($scope.command));

				$scope.command = '';
			}
		};
	});
