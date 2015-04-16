/*------------------------------------------------------
 * @Author: Shreyas Bedekar
 * CreatedOn: 12/04/2015
 * ModifiedOn: 15/04/2105
 * Directives for Form
 ------------------------------------------------------*/
app.directive('alphaNumeric', function() {
	return function(scope, element) { restrict:
		'A', element.bind('keypress', function(event) {
			var regex = new RegExp("^[a-zA-Z0-9 ]+$");
			var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
			if (!regex.test(key)) {
				event.preventDefault();
				return false;
			}
		});
	};
});

app.directive('numeric', function() {
	return function($scope, $element) { restrict:
		'A', $element.bind('keypress', function(event) {
			var regex = new RegExp("^[0-9.]+$");
			var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
			if (!regex.test(key)) {
				event.preventDefault();
				return false;
			}
		});
	};
});

app.directive('entertosave', function() {
	return function($scope, $element) { 
		restrict:'A', 
		$element.bind('keypress', function(event) {
			if(event.keyCode === 13){
				$scope.save();
			}	
		});
	};
});
