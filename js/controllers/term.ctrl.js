termApp.controller('mainController', function($scope, interpreter) {

	$scope.command = '';
	$scope.output = [];

	$scope.execute = (keyEvent) => {
		if (keyEvent.which === 13) {
			var screen = {
				'command': $scope.command
			};

			$scope.output.push(screen);
			interpreter.exec($scope.command, (result) => {
				screen.result = result;
				$scope.$apply();
				window.scrollTo(0,document.body.scrollHeight);
			});

			$scope.command = '';
		}
	};
});
