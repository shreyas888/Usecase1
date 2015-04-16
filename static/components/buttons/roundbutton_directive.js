/*------------------------------------------------------
 * @Author: Shreyas Bedekar
 * CreatedOn: 12/04/2015
 * ModifiedOn: 15/04/2105
 * Directive for Round Button
 ------------------------------------------------------*/
app.directive('roundButton', ['$location', '$rootScope',
function($location, $rootScope) {
	return {
		restrict : 'E',
		scope : {
			url : '@url',
			text : '@text',
			cls : '@cls',
			icon : '@icon'
		},
		link : function($scope, $element, $attrs) {
			//Set Clicked button as Active 
			$scope.active = '';
			var elementPath = $attrs.url.substring(1);
			$scope.$location = $location;
			$scope.$watch('$location.path()', function(locationPath) {
				if (elementPath === locationPath) {
					$scope.active = $scope.cls + '-active';
					$rootScope.title = $scope.text;
					$rootScope.cls = $scope.cls + '-text';
				} else {
					$scope.active = '';
				}
			});
		},
		templateUrl : 'components/buttons/_roundbutton.html'
	};
}]);