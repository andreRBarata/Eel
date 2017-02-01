angular.module('termApp')
	.directive('inputHighlight', function () {
		return {
			scope: {
				onexec: '='
			},
			templateUrl:  'inputHighlight/inputHighlight.tpl.html',
			controller: function InputHighlight($scope) {
				function init() {
					$scope.prev = [];
					$scope.current = '';
				}

				init();

				$scope.onchange = (event) => {
					if (event.code === 'Space') {
						$scope.saveSegment();
					}
					else if (event.code === 'Backspace') {
						if ($scope.current.length === 0) {
							$scope.current = $scope.prev
								.pop();
						}
					}
					else if (event.code === 'Enter') {
						$scope.saveSegment();

						$scope.onexec(
							$scope.prev.join(' ')
						);

						init();
					}
				};

				$scope.saveSegment = () => {
					$scope.prev.push($scope.current);
					$scope.current = '';
				};
			}
		};
	});
