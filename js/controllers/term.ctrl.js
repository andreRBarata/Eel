termApp.controller("mainController", function($scope, $cash, $electron) {

	$scope.command = "";
	$scope.output = [];

	$scope.execute = (keyEvent) => {
		if (keyEvent.which === 13) {
			$scope.output.push({
				"command": $scope.command,
				"result": $cash($scope.command)
			});

			$scope.command = "";
		}
	}
});
