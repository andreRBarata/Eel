angular.module('termApp')
	.controller('mainController', function($scope, interpreter) {

		$scope.command = '';
		//TODO:90 Fix all output to the same command error
		$scope.output = [];

		interpreter.when('loaded', () => {
			//TODO:130 See about treatment of nulls
			interpreter.stdout.each((result) => {
				if (result !== null) {
					$scope.output.push(result);
					$scope.$apply();
					window.scrollTo(0,document.body.scrollHeight);
				}
			});
		});



		$scope.execute = (keyEvent) => {
			if (keyEvent.which === 13) {
				interpreter.when('loaded', () => {
					$scope.output.push($scope.command);

					console.log(interpreter.runCode($scope.command));

					$scope.command = '';
				});
			}
		};
	});
