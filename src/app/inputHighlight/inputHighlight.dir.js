angular.module('termApp')
	.directive('inputHighlight', () => {
		return {
			scope: {
				onexec: '=',
				command: '=',
				readonly: '=',
				history: '='
			},
			compile(element, attrs) {
				if (!attrs.command) { attrs.command = ''; }
			},
			templateUrl: 'inputHighlight/inputHighlight.tpl.html',
			controller: function InputHighlight($scope) {
				$scope.curLocation = -1;
				$scope.cmOption = {
					lineNumbers: false,
					indentWithTabs: true,
					lineWrapping: true,
					mode: 'eelscript',
					cursorHeight: 1,
					readOnly: $scope.readonly,
					extraKeys: {
						Up(cm) {
							if (cm.getCursor().line === 0) {
								$scope.curLocation--;

								if ($scope.curLocation < 0) {
									$scope.curLocation = $scope
										.history.length;
								}

								$scope.command = $scope
									.history[$scope.curLocation];
								$scope.$apply();
							}
						},
						Down(cm) {
							if (cm.getCursor().line === cm.firstLine()) {
								$scope.curLocation++;

								if ($scope.curLocation < 0) {
									$scope.curLocation = $scope
										.history.length;
								}

								$scope.command = $scope
									.history[$scope.curLocation];
								$scope.$apply();
							}
						},
						Enter(cm) {
							$scope.curLocation = -1;

							$scope.onexec(
								$scope.command
							);

							$scope.command = '';
							$scope.$apply();
						}
					}
				};
			}
		};
	});
