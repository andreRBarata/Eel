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
				//TODO: Try to add greyed out auto complete history id:24
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
							else {
								CodeMirror.commands
									.goLineUp(cm);
							}
						},
						Down(cm) {
							if (cm.getCursor().line === cm.lastLine()) {
								$scope.curLocation++;

								if ($scope.curLocation > $scope.length) {
									$scope.curLocation = $scope
										.history.length;
								}

								$scope.command = $scope
									.history[$scope.curLocation];
								$scope.$apply();
							}
							else {
								CodeMirror.commands
									.goLineDown(cm);
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
