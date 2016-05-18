termApp.controller("mainController", function($scope, $cash, $electron) {

	$scope.command = "";
	$scope.output = "";

	$scope.execute = (keyEvent) => {
		if (keyEvent.which === 13) {
			$scope.output += `${$scope.command}\n\n`;
			$scope.output += $cash($scope.command);

			$scope.command = "";

			window.scrollTo(0,document.body.scrollHeight);
		}
	}
});
