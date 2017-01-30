angular.module('termApp')
	.controller('mainController', ($scope, vm) => {
		$scope.vmscope = vm._context;

		$scope.command = '';
		//TODO:90 Fix all output to the same command error id:4
		$scope.output = [];

		//TODO:130 See about treatment of nulls id:5
		$scope.vmscope
			.stdout
			.batchWithTimeOrCount(10, 300)
			.each((result) => {
				if (result !== null) {
					for (let line of result) {
						$scope.output.push(line);
					}
					$scope.$apply();
					window.scrollTo(0,document.body.scrollHeight);
				}
			});

		$scope.execute = (keyEvent) => {
			if (keyEvent.which === 13) {
				$scope.vmscope
					.stdout.write({html: $scope.command});

				vm.run($scope.command);

				$scope.command = '';
			}
		};
	});
