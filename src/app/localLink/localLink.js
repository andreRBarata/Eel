const path = require('path');

angular.module('termApp')
	.directive('localLink', () => {

		return {
			scope: {
				of: '='
			},
			controller:
				function localLinkDirective($scope, commandService) {
					$scope.$watch('of', (newval, oldval) => {
						let part = $scope.of
							.split(path.sep);

						$scope.parts = part
							.map((segment, index) => {
								return {
									segment: segment,
									path: part
										.slice(0, index + 1)
										.join(path.sep)
								};
							});

					});

					$scope.go = (path) => {
						commandService.execute(`#cd "${
							path
						}"`)
					};
				},
			template: `
				<span ng-repeat="part in parts track by $index">
					<a ng-click="go(part.path)">
						{{part.segment}}
					</a> {{$last ? '' : ' / '}}
				</span>
			`
		};
	});
