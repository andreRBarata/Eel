const Type = require('type-of-is');

angular.module('termApp')
	.controller('mainController', ($scope, vm) => {
		$scope.process = vm._context
			.process;
		$scope.cwd = process.cwd();
		$scope.command = '';
		//TODO:90 Fix all output to the same command error id:4
		$scope.output = [];
		$scope.scrollDown = () =>
			window.scrollTo(0, document.body.scrollHeight);

		$scope.process
			.stdout.on('cwdchange', (cwd) => {
				$scope.cwd = cwd;
				$scope.$apply();
			});

		$scope.execute = (command) => {
			$scope.process
				.stdout.write({
					html: `<input-highlight command="src" readonly="true"></input-highlight>`,
					scope: command
				});

			try {
				vm.run(command);
			}
			catch (err) {
				$scope.process
					.stdout.emit('error', err);

			}
		};
	});
