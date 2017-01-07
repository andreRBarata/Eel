angular.module('termApp')
	.controller('mainController', function($scope, vm) {

		$scope.command = '';
		//TODO:90 Fix all output to the same command error
		$scope.output = [];
		console.log(vm);
		//TODO:130 See about treatment of nulls
		vm.options.sandbox.stdout.each((result) => {
			if (result !== null) {
				$scope.output.push(result);
				$scope.$apply();
				window.scrollTo(0,document.body.scrollHeight);
			}
		});

		$scope.execute = (keyEvent) => {
			if (keyEvent.which === 13) {
				$scope.output.push($scope.command);

				console.log(vm.run($scope.command));

				$scope.command = '';
			}
		};
	});
