const path = require('path');

angular.module('termApp')
	.directive('pathLink', () => {

		return {
			scope: {
				of: '='
			},
			controller:
				function pathLink($scope, commandService) {
					$scope.$watch('of', (newval, oldval) => {
						let part = $scope.of
							.split(path.sep);

						$scope.seperator = path.sep;

						$scope.parts = part
							.map((segment, index) => {
								return {
									segment: segment,
									path: part
										.slice(0, index + 1)
										.join((path.sep === '\\')?
											'\\\\':
											path.sep
										)
								};
							});

					});
				},
			template: `
				<span ng-repeat="part in parts track by $index">
					<a local-ref="part.path">{{part.segment}}</a>
						{{$last ? '' : seperator}}
				</span>
			`
		};
	});
