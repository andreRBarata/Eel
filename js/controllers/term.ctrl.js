termApp.controller("mainController", function($scope, $exec, $electron) {

	$scope.command = "";
	$scope.output = [];

	$scope.execute = (keyEvent) => {
		if (keyEvent.which === 13) {
			var line = {
				"command": $scope.command
			};


			$exec($scope.command, (stdout, stderr) => {
				line.result = stdout;

				$scope.$apply();
			});

			$scope.output.push(line);

			$scope.command = "";
		}
	}
});
