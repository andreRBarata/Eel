angular.module('termApp')
	.directive('streamDisplay', function () {
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
						.each((ele) => {
							let tmpscope = $scope.$new(true, $scope);
							tmpscope.src = ele.scope;

							try {
								$element.append(
									$compile(`<span>${ele.html}</span>`)(tmpscope)
								);
							}
							catch(err) {
								throw new Error('HTML template must be wrapped in a tag');
							}
						});
				}
		}
	});
