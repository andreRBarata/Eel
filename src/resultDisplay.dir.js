angular.module('termApp')
	.directive('resultDisplay', function ($compile) {
		return {
			scope: {
				src: '=',
				template: '='
			},
			link: (scope, element, attrs) => {
				console.log(scope);
				element.html(scope.template);
		        $compile(element.contents())(scope);
			},
		}
	});
