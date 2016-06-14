termApp.controller('mainController', function($scope, interpreter) {
	interpreter.use('./js/interpreter/commands/catch-default');
	interpreter.use('./js/interpreter/commands/command-cd');

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
