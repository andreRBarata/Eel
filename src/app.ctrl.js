angular.module('termApp')
	.controller('mainController', ($scope, vm) => {

		$scope.command = '';
		//TODO:90 Fix all output to the same command error id:4
		$scope.output = [];

		//TODO:130 See about treatment of nulls id:5
		vm.options.sandbox
			.stdout
			.batchWithTimeOrCount(10, 300)
			.each((result) => {
				if (result !== null) {
					for (let line of result) {
						console.log(line);
						$scope.output.push(line);
					}

					$scope.$apply();
					window.scrollTo(0,document.body.scrollHeight);
				}
			});

		$scope.execute = (keyEvent) => {
			if (keyEvent.which === 13) {
				$scope.output.push({html: $scope.command});

				console.log(vm.run($scope.command));

				$scope.command = '';
			}
		};
	});
