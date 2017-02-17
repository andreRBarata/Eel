angular.module('termApp')
	.directive('streamDisplay', () => {
		return {
			scope: {
				src: '='
			},
			controller:
				function ResultDisplayController($scope, $compile, $element) {
					$scope.src
						.on('error', (err) => {
						 	$scope.src
								.write({
									html:
										`<div class="alert alert-danger" role="alert">{{src}}</div>`,
									scope: err.message
								});
						})
						.map((ele) => {
							let tmpscope = $scope.$new(true);
							tmpscope.src = ele.scope;

							$element.append(
								$compile(`<section style="display: inline;">${ele.html}</section>`)(tmpscope)
							);

							return tmpscope;
						})
						.debounce(10)
						.each((tmpscope) => {
							tmpscope.$apply();
						});
				}
		}
	});
