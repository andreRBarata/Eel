const Type = require('type-of-is');

angular.module('termApp')
	.controller('mainController', ($scope, vm) => {
		$scope.process = vm._context
			.process;
		$scope.cwd = process.cwd();
		$scope.command = '';
		//TODO:90 Fix all output to the same command error id:4
		$scope.output = [];

		//TODO:130 See about treatment of nulls id:5
		$scope.process
			.stdout
			.on('error', (err) => {
			 	$scope.process.stdout
					.write({
						html:
							`<div class="alert alert-danger" role="alert">{{src}}</div>`,
						scope: err.message
					});
			})
			.on('cwdchange', (cwd) => {
				console.log(cwd);
				$scope.cwd = cwd;
				$scope.$apply();
			})
			.batchWithTimeOrCount(10, 300)
			.each((result) => {
				if (result !== null) {
					for (let line of result) {
						$scope.output.push(line);
					}
					$scope.$apply();
					window.scrollTo(0, document.body.scrollHeight);
				}
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
